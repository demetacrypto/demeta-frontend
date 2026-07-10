import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lintManifest } from "../scripts/evaluate-manifest.mjs";

const here = dirname(fileURLToPath(import.meta.url));

async function accepted() {
  return JSON.parse(await readFile(join(here, "fixtures", "accepted-pressure-atlas.json"), "utf8"));
}

function codes(result) {
  return new Set(result.lintFailures.map(({ code }) => code));
}

function keywords(result) {
  return new Set(result.lintFailures.map(({ keyword }) => keyword).filter(Boolean));
}

test("schema-valid flagship declarations pass manifest lint without claiming runtime verification", async () => {
  const result = lintManifest(await accepted());
  assert.equal(result.schemaValid, true);
  assert.equal(result.manifestLintPass, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.advisoryAestheticScore, 100);
  assert.deepEqual(result.lintFailures, []);
  assert.match(result.limitations.join(" "), /does not verify browser behavior/i);
});

test("rejects generic template architecture even when schema-valid", async () => {
  const manifest = await accepted();
  manifest.project.niche = "SaaS";
  manifest.project.singleJob = "Get started";
  manifest.concepts[0].fingerprint.composition = "left-right";
  const result = lintManifest(manifest);
  assert.equal(result.schemaValid, true);
  assert.equal(result.manifestLintPass, false);
  assert.ok(codes(result).has("project.niche"));
  assert.ok(codes(result).has("project.single_job"));
  assert.ok(codes(result).has("concepts.template_pattern"));
});

test("rejects inaccessible graphics declarations including missing non-drag alternative", async () => {
  const manifest = await accepted();
  manifest.graphics.criticalContentInDom = false;
  manifest.accessibility.keyboardComplete = false;
  manifest.accessibility.reducedMotion = false;
  manifest.accessibility.nonDragAlternative = false;
  const result = lintManifest(manifest);
  assert.ok(codes(result).has("graphics.dom_equivalent"));
  assert.ok(codes(result).has("a11y.keyboardComplete"));
  assert.ok(codes(result).has("a11y.reducedMotion"));
  assert.ok(codes(result).has("a11y.nonDragAlternative"));
});

test("rejects concept candidates that are cosmetic variants", async () => {
  const manifest = await accepted();
  manifest.concepts[1].fingerprint = structuredClone(manifest.concepts[0].fingerprint);
  const result = lintManifest(manifest);
  assert.ok(codes(result).has("concepts.fingerprint_similarity"));
});

test("schema rejects removal of required thesis and architecture objects", async () => {
  const withoutThesis = await accepted();
  delete withoutThesis.thesis;
  const thesisResult = lintManifest(withoutThesis);
  assert.equal(thesisResult.schemaValid, false);
  assert.ok(keywords(thesisResult).has("required"));

  const withoutArchitecture = await accepted();
  delete withoutArchitecture.architecture;
  const architectureResult = lintManifest(withoutArchitecture);
  assert.equal(architectureResult.schemaValid, false);
  assert.ok(keywords(architectureResult).has("required"));
});

test("schema rejects unknown properties and enum errors", async () => {
  const extra = await accepted();
  extra.project.premium = true;
  const extraResult = lintManifest(extra);
  assert.equal(extraResult.schemaValid, false);
  assert.ok(keywords(extraResult).has("additionalProperties"));

  const invalidEnum = await accepted();
  invalidEnum.stage = "shipped";
  const enumResult = lintManifest(invalidEnum);
  assert.equal(enumResult.schemaValid, false);
  assert.ok(keywords(enumResult).has("enum"));
});

test("semantic lint enforces unique concept, claim, asset, and evidence IDs", async () => {
  const manifest = await accepted();
  manifest.concepts[1].id = manifest.concepts[0].id;
  manifest.claims.push({ ...manifest.claims[0] });
  manifest.assets[1].id = manifest.assets[0].id;
  manifest.evidence.reports[1].id = manifest.evidence.screenshots[0].id;
  const result = lintManifest(manifest);
  assert.equal(result.schemaValid, true);
  assert.ok(codes(result).has("concepts.duplicate_ids"));
  assert.ok(codes(result).has("claims.duplicate_ids"));
  assert.ok(codes(result).has("assets.duplicate_ids"));
  assert.ok(codes(result).has("evidence.duplicate_ids"));
});

test("schema rejects invalid SHA-256 and non-SPDX-ish license identifiers", async () => {
  const manifest = await accepted();
  manifest.assets[0].sha256 = "not-a-hash";
  manifest.assets[1].license = "do whatever you want";
  const result = lintManifest(manifest);
  assert.equal(result.schemaValid, false);
  assert.ok(keywords(result).has("pattern"));
});

test("schema enforces generated and licensed asset metadata conditions", async () => {
  const generated = await accepted();
  delete generated.assets[1].generator;
  delete generated.assets[1].generatedAt;
  const generatedResult = lintManifest(generated);
  assert.equal(generatedResult.schemaValid, false);
  assert.ok(keywords(generatedResult).has("required"));

  const licensed = await accepted();
  licensed.assets[0] = {
    id: "licensed-map",
    type: "raster",
    source: "licensed",
    creator: "Example Cartographer",
    license: "CC-BY-4.0",
    path: "public/assets/map.webp",
    sha256: "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
  };
  const licensedResult = lintManifest(licensed);
  assert.equal(licensedResult.schemaValid, false);
  assert.ok(keywords(licensedResult).has("required"));
});

test("schema requires sources for verified claims and forbids placeholders in releases", async () => {
  const unsourced = await accepted();
  unsourced.claims[0] = {
    id: "depth-record",
    text: "This is the deepest expedition archive.",
    status: "verified"
  };
  const unsourcedResult = lintManifest(unsourced);
  assert.equal(unsourcedResult.schemaValid, false);
  assert.ok(keywords(unsourcedResult).has("required"));

  const placeholder = await accepted();
  placeholder.claims[0].status = "placeholder";
  const placeholderResult = lintManifest(placeholder);
  assert.equal(placeholderResult.schemaValid, false);
  assert.ok(keywords(placeholderResult).has("enum"));
});

test("schema requires explicit user-brief provenance for user-supplied claims", async () => {
  const unsourced = await accepted();
  unsourced.claims[0] = {
    id: "fictional-status",
    text: "Pressure Atlas is a fictional demonstration archive.",
    status: "user_supplied"
  };
  const unsourcedResult = lintManifest(unsourced);
  assert.equal(unsourcedResult.schemaValid, false);
  assert.ok(keywords(unsourcedResult).has("required"));

  const wrongSourceType = await accepted();
  wrongSourceType.claims[0].sourceType = "first-party-document";
  const wrongSourceTypeResult = lintManifest(wrongSourceType);
  assert.equal(wrongSourceTypeResult.schemaValid, false);
  assert.ok(keywords(wrongSourceTypeResult).has("const"));
});

test("schema rejects negative or excessive performance budgets", async () => {
  const manifest = await accepted();
  manifest.performanceBudget.initialJsKbGzip = -1;
  manifest.performanceBudget.mediaMbMobile = 12;
  manifest.performanceBudget.tbtMs = 201;
  const result = lintManifest(manifest);
  assert.equal(result.schemaValid, false);
  assert.ok(keywords(result).has("minimum"));
  assert.ok(keywords(result).has("maximum"));
});

test("schema requires a total-blocking-time budget", async () => {
  const manifest = await accepted();
  delete manifest.performanceBudget.tbtMs;
  const result = lintManifest(manifest);
  assert.equal(result.schemaValid, false);
  assert.ok(keywords(result).has("required"));
});

test("schema requires fuller candidate reasoning", async () => {
  const manifest = await accepted();
  delete manifest.selectionRationale;
  delete manifest.concepts[0].tradeoff;
  const result = lintManifest(manifest);
  assert.equal(result.schemaValid, false);
  assert.ok(keywords(result).has("required"));
});
