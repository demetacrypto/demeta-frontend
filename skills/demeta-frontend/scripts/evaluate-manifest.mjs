#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import validateDesignManifest from "./generated/design-manifest-validator.mjs";

const REQUIRED_FINGERPRINT_FIELDS = Object.freeze([
  "heroArchetype",
  "composition",
  "palette",
  "geometry",
  "primaryVisual",
  "motionSignature",
  "typography",
  "sectionRhythm",
  "headerArchitecture",
  "heroFrame",
  "scrollDepthSystem"
]);

const REQUIRED_ACCESSIBILITY_FIELDS = Object.freeze([
  "semanticDom",
  "keyboardComplete",
  "visibleFocus",
  "contrastChecked",
  "zoomAndReflowChecked",
  "reducedMotion",
  "canvasAlternative",
  "nonDragAlternative",
  "targetSizeChecked",
  "errorsAnnounced"
]);

const AESTHETIC_CATEGORIES = new Set(["concept", "niche", "originality", "craft", "graphics", "motion"]);
const REQUIRED_REPORT_KINDS = Object.freeze(["build", "keyboard", "axe", "performance", "console"]);
const NON_GRAPHICS_MEDIA = new Set(["", "none", "css", "stock-photo", "generic-dashboard"]);
const VAGUE_ACTIONS = /^(learn more|get started|submit|click here|explore|discover)$/i;

function lintFailure(code, message, category, advisoryPoints = 0, details = {}) {
  return Object.freeze({ code, message, category, advisoryPoints, ...details });
}

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function checkProject(manifest) {
  const { project } = manifest;
  return [
    ...(/^saas$/i.test(project.niche.trim())
      ? [lintFailure("project.niche", "Name a concrete niche rather than a generic product class.", "niche", 5)]
      : []),
    ...(VAGUE_ACTIONS.test(project.singleJob.trim())
      ? [lintFailure("project.single_job", "Define one specific visitor outcome.", "concept", 5)]
      : [])
  ];
}

function checkNiche(manifest) {
  const niche = manifest.nicheIntelligence;
  const enough = niche.artifacts.length >= 3
    && niche.rituals.length >= 2
    && niche.proofSignals.length >= 2
    && niche.sensoryCues.length >= 2
    && !VAGUE_ACTIONS.test(niche.conversionAction.trim());
  return enough
    ? []
    : [lintFailure("niche.insufficient", "Add concrete artifacts, rituals, proof, sensory cues, and a specific conversion action.", "niche", 12)];
}

function fingerprintSimilarity(left = {}, right = {}) {
  const shared = REQUIRED_FINGERPRINT_FIELDS.filter((field) => (
    isNonEmpty(left[field])
      && isNonEmpty(right[field])
      && left[field].trim().toLowerCase() === right[field].trim().toLowerCase()
  ));
  return Object.freeze({ shared, ratio: shared.length / REQUIRED_FINGERPRINT_FIELDS.length });
}

function conceptPairs(concepts) {
  return concepts.flatMap((concept, index) => (
    concepts.slice(index + 1).map((candidate) => Object.freeze([concept, candidate]))
  ));
}

function duplicateIds(entries) {
  const counts = entries.reduce((summary, item) => Object.freeze({
    ...summary,
    [item.id]: (summary[item.id] || 0) + 1
  }), Object.freeze({}));
  return Object.keys(counts).filter((id) => counts[id] > 1);
}

function uniquenessFailure(entries, collection) {
  const duplicates = duplicateIds(entries);
  return duplicates.length === 0
    ? []
    : [lintFailure(
        `${collection}.duplicate_ids`,
        `${collection} IDs must be unique; duplicates: ${duplicates.join(", ")}.`,
        "integrity"
      )];
}

function checkConcepts(manifest) {
  const concepts = manifest.concepts;
  const roles = new Set(concepts.map(({ mode }) => mode));
  const roleFailures = ["commercially-safe", "visually-ambitious", "niche-native"].every((mode) => roles.has(mode))
    ? []
    : [lintFailure("concepts.roles", "Candidates must cover commercially-safe, visually-ambitious, and niche-native reasoning roles.", "concept", 8)];
  const similarityFailures = conceptPairs(concepts).flatMap(([left, right]) => {
    const similarity = fingerprintSimilarity(left.fingerprint, right.fingerprint);
    const forbiddenHeroPair = similarity.shared.includes("heroArchetype") && similarity.shared.includes("composition");
    const forbiddenFramePair = similarity.shared.includes("headerArchitecture") && similarity.shared.includes("heroFrame");
    return similarity.ratio > 0.45 || forbiddenHeroPair || forbiddenFramePair
      ? [lintFailure(
          "concepts.fingerprint_similarity",
          `${left.id} and ${right.id} share ${similarity.shared.join(", ") || "too much structure"}.`,
          "originality",
          12
        )]
      : [];
  });
  const selectionFailures = concepts.some(({ id }) => id === manifest.selectedConcept)
    ? []
    : [lintFailure("concepts.selection", "selectedConcept must match one candidate ID.", "concept", 8)];
  const fingerprints = concepts.map(({ fingerprint }) => Object.values(fingerprint).join(" ").toLowerCase());
  const templateFailures = fingerprints.some((value) => (
    value.includes("left-right")
      || value.includes("pill-nav")
      || value.includes("purple-blue-gradient")
      || value.includes("fade-only")
  ))
    ? [lintFailure("concepts.template_pattern", "Reject split-hero, pill-nav, default-gradient, and fade-only template signals.", "originality", 8)]
    : [];
  return [
    ...roleFailures,
    ...uniquenessFailure(concepts, "concepts"),
    ...similarityFailures,
    ...selectionFailures,
    ...templateFailures
  ];
}

function checkSystem(manifest) {
  const { system } = manifest;
  const typeFamilies = Object.values(system.typography);
  const defaultTypeCluster = typeFamilies.every((family) => /^inter$/i.test(family.trim()));
  return [
    ...(defaultTypeCluster
      ? [lintFailure("system.typography", "Reject one-font defaulting; define deliberate display, body, and utility roles.", "craft", 5)]
      : [])
  ];
}

function checkGraphics(manifest) {
  const { graphics } = manifest;
  const medium = graphics.primaryMedium.trim().toLowerCase();
  const runtimeChecks = Object.entries({
    lazyLoaded: "Lazy-load the enhanced graphics path.",
    pauseWhenHidden: "Pause rendering when hidden or offscreen.",
    disposeOnUnmount: "Dispose owned GPU resources on unmount.",
    handlesContextLoss: "Handle context/device loss without blanking the offer."
  });
  return [
    ...(NON_GRAPHICS_MEDIA.has(medium)
      ? [lintFailure("graphics.missing", "A flagship needs a justified authored visual medium, not generic CSS, stock, or dashboard decoration.", "graphics", 15)]
      : []),
    ...(graphics.criticalContentInDom
      ? []
      : [lintFailure("graphics.dom_equivalent", "Keep critical meaning, copy, and controls in semantic DOM.", "accessibility")]),
    ...runtimeChecks.flatMap(([field, message]) => (
      graphics.runtime[field]
        ? []
        : [lintFailure(`graphics.${field}`, message, field === "handlesContextLoss" ? "graphics" : "performance", field === "handlesContextLoss" ? 5 : 0)]
    ))
  ];
}

function checkMotion(manifest) {
  const { motion } = manifest;
  return motion.autoMotionOverFiveSeconds && !motion.pauseControl
    ? [lintFailure("motion.pause_control", "Automatic motion over five seconds needs a pause/stop control.", "accessibility")]
    : [];
}

function checkAccessibility(manifest) {
  const fieldFailures = REQUIRED_ACCESSIBILITY_FIELDS.flatMap((field) => (
    manifest.accessibility[field] === true
      ? []
      : [lintFailure(`a11y.${field}`, `${field} must be browser-verified before production.`, "accessibility")]
  ));
  return fieldFailures;
}

function checkIntegrity(manifest) {
  const productionLike = ["production", "verified"].includes(manifest.stage);
  const placeholders = manifest.claims.filter(({ status }) => status === "placeholder");
  const missingHashes = manifest.assets.filter(({ sha256 }) => !isNonEmpty(sha256));
  return [
    ...uniquenessFailure(manifest.claims, "claims"),
    ...uniquenessFailure(manifest.assets, "assets"),
    ...(productionLike && placeholders.length > 0
      ? [lintFailure("claims.placeholder_in_release", "Production/verified work cannot ship placeholder proof or claims.", "integrity")]
      : []),
    ...(productionLike && missingHashes.length > 0
      ? [lintFailure("assets.hashes_in_release", "Production/verified assets require SHA-256 hashes.", "integrity")]
      : [])
  ];
}

function checkEvidence(manifest) {
  const { evidence } = manifest;
  const evidenceEntries = [...evidence.screenshots, ...evidence.reports];
  const reportKinds = new Set(evidence.reports.map(({ kind }) => kind));
  const missingReports = REQUIRED_REPORT_KINDS.filter((kind) => !reportKinds.has(kind));
  const productionLike = ["production", "verified"].includes(manifest.stage);
  return [
    ...uniquenessFailure(evidenceEntries, "evidence"),
    ...(productionLike && missingReports.length > 0
      ? [lintFailure("evidence.report_kinds", `Release evidence is missing report kinds: ${missingReports.join(", ")}.`, "evidence")]
      : [])
  ];
}

function schemaFailures(errors) {
  return Object.freeze(list(errors).map((error) => lintFailure(
    `schema.${error.keyword}`,
    `${error.instancePath || "/"} ${error.message || "is invalid"}.`,
    "schema",
    0,
    {
      keyword: error.keyword,
      instancePath: error.instancePath,
      schemaPath: error.schemaPath,
      params: error.params
    }
  )));
}

function summarize(failures) {
  const categoryDeductions = failures.reduce((summary, item) => Object.freeze({
    ...summary,
    [item.category]: (summary[item.category] || 0) + item.advisoryPoints
  }), Object.freeze({}));
  const aestheticDeduction = failures
    .filter(({ category }) => AESTHETIC_CATEGORIES.has(category))
    .reduce((total, { advisoryPoints }) => total + advisoryPoints, 0);
  return Object.freeze({
    advisoryAestheticScore: Math.max(0, 100 - aestheticDeduction),
    categoryDeductions
  });
}

function resultFor(schemaValid, failures) {
  const summary = summarize(failures);
  return Object.freeze({
    schemaValid,
    manifestLintPass: schemaValid && failures.length === 0,
    advisoryAestheticScore: summary.advisoryAestheticScore,
    advisoryOnly: true,
    lintFailures: Object.freeze(failures),
    categoryDeductions: summary.categoryDeductions,
    limitations: Object.freeze([
      "This result validates declarations; it does not verify browser behavior, visual quality, performance, accessibility, provenance ownership, or legal rights.",
      "Run verify-project.mjs for file existence and SHA-256 checks, then run the browser and human review gates."
    ])
  });
}

export function lintManifest(manifest) {
  const schemaValid = validateDesignManifest(manifest);
  if (!schemaValid) {
    return resultFor(false, schemaFailures(validateDesignManifest.errors));
  }
  const failures = Object.freeze([
    ...checkProject(manifest),
    ...checkNiche(manifest),
    ...checkConcepts(manifest),
    ...checkSystem(manifest),
    ...checkGraphics(manifest),
    ...checkMotion(manifest),
    ...checkAccessibility(manifest),
    ...checkIntegrity(manifest),
    ...checkEvidence(manifest)
  ]);
  return resultFor(true, failures);
}

async function main() {
  const manifestArgument = process.argv[2];
  if (!manifestArgument) {
    throw new Error("Usage: node /absolute/path/to/scripts/evaluate-manifest.mjs <design-manifest.json>");
  }
  const manifestPath = resolve(process.cwd(), manifestArgument);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const result = lintManifest(manifest);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = result.manifestLintPass ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
