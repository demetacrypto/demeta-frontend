import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { verifyProjectArtifacts } from "../scripts/verify-project.mjs";

const here = dirname(fileURLToPath(import.meta.url));

function hash(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function fixture() {
  return JSON.parse(await readFile(join(here, "fixtures", "accepted-pressure-atlas.json"), "utf8"));
}

async function createProject(t) {
  const root = await mkdtemp(join(tmpdir(), "demeta-verify-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const manifest = await fixture();
  const references = [...manifest.assets, ...manifest.evidence.screenshots, ...manifest.evidence.reports];
  await Promise.all(references.map(async (entry) => {
    const content = Buffer.from(`artifact:${entry.id}\n`, "utf8");
    const target = join(root, entry.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
    entry.sha256 = hash(content);
  }));
  return { root, manifest };
}

test("verifies contained project artifacts and SHA-256 without executing commands", async (t) => {
  const { root, manifest } = await createProject(t);
  const marker = join(root, "command-was-executed");
  manifest.evidence.buildCommand = `node -e \"require('node:fs').writeFileSync('${marker}', 'bad')\"`;
  const result = await verifyProjectArtifacts(manifest, root);
  assert.equal(result.projectEvidencePass, true);
  assert.equal(result.commandsExecuted, false);
  assert.equal(result.checkedFiles.length, manifest.assets.length + manifest.evidence.screenshots.length + manifest.evidence.reports.length);
  await assert.rejects(access(marker));
});

test("reports nonexistent evidence as a project verification failure", async (t) => {
  const { root, manifest } = await createProject(t);
  const missing = manifest.evidence.screenshots[0];
  await rm(join(root, missing.path));
  const result = await verifyProjectArtifacts(manifest, root);
  assert.equal(result.projectEvidencePass, false);
  assert.ok(result.verificationFailures.some(({ code, reference }) => code === "file.missing" && reference === `evidence:${missing.id}`));
});

test("reports hash mismatches without rewriting files or manifests", async (t) => {
  const { root, manifest } = await createProject(t);
  manifest.assets[0].sha256 = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  const result = await verifyProjectArtifacts(manifest, root);
  assert.equal(result.projectEvidencePass, false);
  assert.ok(result.verificationFailures.some(({ code }) => code === "hash.mismatch"));
});

test("rejects schema-invalid traversal references before touching the filesystem", async (t) => {
  const { root, manifest } = await createProject(t);
  manifest.assets[0].path = "../outside.txt";
  const result = await verifyProjectArtifacts(manifest, root);
  assert.equal(result.projectEvidencePass, false);
  assert.equal(result.manifestSchemaValid, false);
  assert.ok(result.verificationFailures.some(({ code }) => code === "manifest.schema"));
});
