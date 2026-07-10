#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const requiredFiles = Object.freeze([
  "SKILL.md",
  "agents/openai.yaml",
  "references/art-direction.md",
  "references/graphics-stack.md",
  "references/quality-gates.md",
  "references/browser-qa.md",
  "references/content-integrity.md",
  "references/asset-provenance.md",
  "references/design-manifest.schema.json",
  "examples/adversarial-prompts.json",
  "LICENSE",
  "package.json",
  "scripts/evaluate-manifest.mjs",
  "scripts/verify-project.mjs",
  "scripts/generated/design-manifest-validator.mjs",
  "tests/evaluate-manifest.test.mjs",
  "tests/verify-project.test.mjs",
  "tests/package-contract.test.mjs"
]);

async function assertFiles() {
  await Promise.all(requiredFiles.map((relativePath) => access(join(root, relativePath))));
}

async function assertMetadata() {
  const skill = await readFile(join(root, "SKILL.md"), "utf8");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  const keys = [...frontmatter.matchAll(/^([a-z_]+):/gm)].map((match) => match[1]);
  if (JSON.stringify(keys) !== JSON.stringify(["name", "description"])) {
    throw new Error(`Unexpected SKILL.md frontmatter keys: ${keys.join(", ")}`);
  }
  if (skill.split("\n").length > 350) {
    throw new Error("SKILL.md exceeds the 350-line context budget");
  }
  const openai = await readFile(join(root, "agents/openai.yaml"), "utf8");
  if (!/default_prompt:\s*"Use \$demeta-frontend/.test(openai)) {
    throw new Error("agents/openai.yaml must explicitly invoke $demeta-frontend");
  }
}

async function assertJson() {
  const schema = JSON.parse(await readFile(join(root, "references/design-manifest.schema.json"), "utf8"));
  const prompts = JSON.parse(await readFile(join(root, "examples/adversarial-prompts.json"), "utf8"));
  if (schema.version !== undefined || schema.properties?.version?.const !== "2.0.0") {
    throw new Error("Design manifest schema version must be 2.0.0");
  }
  if (!Array.isArray(prompts.prompts) || prompts.prompts.length < 10) {
    throw new Error("Expected at least ten adversarial prompts");
  }
  const ids = prompts.prompts.map(({ id }) => id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Adversarial prompt IDs must be unique");
  }
}

function runTests() {
  const result = spawnSync(
    process.execPath,
    ["--test", "tests/evaluate-manifest.test.mjs", "tests/verify-project.test.mjs", "tests/package-contract.test.mjs"],
    { cwd: root, encoding: "utf8" }
  );
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`Skill tests failed with exit code ${result.status}`);
  }
}

await assertFiles();
await assertMetadata();
await assertJson();
runTests();
process.stdout.write("demeta-frontend skill package verified: schema, manifest lint, project evidence verifier, and package contract are green\n");
