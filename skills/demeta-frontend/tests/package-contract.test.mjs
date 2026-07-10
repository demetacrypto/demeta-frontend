import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

async function text(relativePath) {
  return readFile(join(root, relativePath), "utf8");
}

async function exists(relativePath) {
  try {
    await access(join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

test("SKILL.md is a compact router with valid minimal frontmatter", async () => {
  const skill = await text("SKILL.md");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  const keys = [...frontmatter.matchAll(/^([a-z_]+):/gm)].map((match) => match[1]);
  assert.deepEqual(keys, ["name", "description"]);
  assert.ok(skill.split("\n").length <= 350);
  assert.match(skill, /references\/art-direction\.md/);
  assert.match(skill, /references\/graphics-stack\.md/);
  assert.match(skill, /scripts\/evaluate-manifest\.mjs/);
  assert.match(skill, /scripts\/verify-project\.mjs/);
  assert.doesNotMatch(skill, /MotionSites-derived|MotionSites-style/i);
  assert.doesNotMatch(skill, /Product:\s*modern SaaS|Default product:\s*SaaS/i);
});

test("every directly linked local resource exists", async () => {
  const skill = await text("SKILL.md");
  const resources = [...skill.matchAll(/`((?:references|scripts|examples|assets)\/[A-Za-z0-9._/-]+)`/g)]
    .map((match) => match[1]);
  assert.ok(resources.length >= 7);
  for (const resource of resources) {
    assert.equal(await exists(resource), true, `missing ${resource}`);
  }
});

test("skill UI metadata explicitly invokes $demeta-frontend", async () => {
  const yaml = await text("agents/openai.yaml");
  assert.match(yaml, /display_name:\s*"DEMETA Frontend"/);
  assert.match(yaml, /short_description:\s*".{25,64}"/);
  assert.match(yaml, /default_prompt:\s*"Use \$demeta-frontend/);
});

test("graphics reference covers material simulations and production safeguards", async () => {
  const graphics = await text("references/graphics-stack.md");
  for (const pattern of [
    /fluid|water/i,
    /glass|transmission|refraction/i,
    /cloth|fabric|verlet/i,
    /Three\.js/i,
    /WebGPU/i,
    /WebGL\s*2/i,
    /GLSL|TSL|WGSL/i,
    /DPR|pixel ratio/i,
    /dispose/i,
    /context loss/i,
    /prefers-reduced-motion/i
  ]) {
    assert.match(graphics, pattern);
  }
});

test("quality and integrity references define non-negotiable evidence", async () => {
  const quality = await text("references/quality-gates.md");
  const integrity = await text("references/content-integrity.md");
  const provenance = await text("references/asset-provenance.md");
  assert.match(quality, /WCAG\s*2\.2\s*AA/i);
  assert.match(quality, /performance budget/i);
  assert.match(quality, /console error/i);
  assert.match(quality, /WebGL.*fallback|fallback.*WebGL/is);
  assert.match(integrity, /claim ledger/i);
  assert.match(integrity, /verified|user_supplied/);
  assert.match(integrity, /Never invent/i);
  assert.match(provenance, /license/i);
  assert.match(provenance, /generated/i);
  assert.match(provenance, /SHA-256|sha256/i);
  assert.match(quality, /advisory aesthetic score/i);
  assert.match(quality, /never executes? `buildCommand`|never execute/i);
});

test("schema and standalone validator enforce the 2.0 contract without runtime packages", async () => {
  const schema = JSON.parse(await text("references/design-manifest.schema.json"));
  const validator = await text("scripts/generated/design-manifest-validator.mjs");
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.version.const, "2.0.0");
  assert.equal(schema.additionalProperties, false);
  assert.match(JSON.stringify(schema), /nonDragAlternative/);
  assert.match(JSON.stringify(schema), /sha256/);
  assert.doesNotMatch(validator, /require\(|from\s+["']ajv/);
  assert.match(validator, /Generated from references\/design-manifest\.schema\.json with Ajv 8\.20\.0/);
});

test("project verifier is path-contained and never executes manifest commands", async () => {
  const verifier = await text("scripts/verify-project.mjs");
  assert.match(verifier, /path\.outside_root|path\.symlink_outside_root/);
  assert.match(verifier, /sha256File/);
  assert.match(verifier, /commandsExecuted:\s*false/);
  assert.doesNotMatch(verifier, /spawn|execFile|execSync|child_process/);
});

test("fixtures include adversarial capability and failure-mode coverage", async () => {
  const fixtures = JSON.parse(await text("examples/adversarial-prompts.json"));
  assert.ok(fixtures.prompts.length >= 10);
  const serialized = JSON.stringify(fixtures);
  for (const pattern of [/RTL/i, /320px/i, /reduced motion/i, /WebGL/i, /regulated/i, /long copy/i, /existing design system/i]) {
    assert.match(serialized, pattern);
  }
});

test("competitor crawl and unrelated admin orchestration are not redistributed", async () => {
  assert.equal(await exists("assets/motionsites-template-dataset.json"), false);
  assert.equal(await exists("references/leadwatch-admin-frontend-lab.md"), false);
  assert.equal(await exists("references/motionsites-patterns.md"), false);
});
