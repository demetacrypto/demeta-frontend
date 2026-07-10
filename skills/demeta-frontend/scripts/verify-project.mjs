#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, realpath, stat } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { lintManifest } from "./evaluate-manifest.mjs";

function verificationFailure(code, message, reference, details = {}) {
  return Object.freeze({ code, message, reference, ...details });
}

function isInside(root, candidate) {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === "" || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== ".." && !isAbsolute(pathFromRoot));
}

async function sha256File(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}

function projectReferences(manifest) {
  const assets = manifest.assets.map(({ id, path, sha256 }) => Object.freeze({
    reference: `asset:${id}`,
    path,
    expectedSha256: sha256
  }));
  const evidence = [...manifest.evidence.screenshots, ...manifest.evidence.reports].map(({ id, path, sha256 }) => Object.freeze({
    reference: `evidence:${id}`,
    path,
    expectedSha256: sha256
  }));
  return Object.freeze([...assets, ...evidence]);
}

async function checkReference(reference, lexicalRoot, canonicalRoot) {
  const lexicalPath = resolve(lexicalRoot, reference.path);
  if (!isInside(lexicalRoot, lexicalPath)) {
    return Object.freeze({
      checked: null,
      failure: verificationFailure("path.outside_root", "Referenced path escapes the declared project root.", reference.reference, { path: reference.path })
    });
  }
  if (!reference.expectedSha256) {
    return Object.freeze({
      checked: null,
      failure: verificationFailure("hash.missing", "Referenced artifact has no declared SHA-256.", reference.reference, { path: reference.path })
    });
  }
  let canonicalPath;
  try {
    canonicalPath = await realpath(lexicalPath);
  } catch (error) {
    return Object.freeze({
      checked: null,
      failure: verificationFailure("file.missing", "Referenced artifact does not exist.", reference.reference, {
        path: reference.path,
        systemCode: error?.code || "UNKNOWN"
      })
    });
  }
  if (!isInside(canonicalRoot, canonicalPath)) {
    return Object.freeze({
      checked: null,
      failure: verificationFailure("path.symlink_outside_root", "Referenced artifact resolves outside the declared project root.", reference.reference, { path: reference.path })
    });
  }
  const fileStat = await stat(canonicalPath);
  if (!fileStat.isFile()) {
    return Object.freeze({
      checked: null,
      failure: verificationFailure("file.not_regular", "Referenced artifact must be a regular file.", reference.reference, { path: reference.path })
    });
  }
  const actualSha256 = await sha256File(canonicalPath);
  if (actualSha256.toLowerCase() !== reference.expectedSha256.toLowerCase()) {
    return Object.freeze({
      checked: null,
      failure: verificationFailure("hash.mismatch", "Referenced artifact SHA-256 does not match the manifest.", reference.reference, {
        path: reference.path,
        expectedSha256: reference.expectedSha256,
        actualSha256
      })
    });
  }
  return Object.freeze({
    checked: Object.freeze({
      reference: reference.reference,
      path: reference.path,
      sha256: actualSha256,
      bytes: fileStat.size
    }),
    failure: null
  });
}

export async function verifyProjectArtifacts(manifest, projectRoot) {
  const lint = lintManifest(manifest);
  if (!lint.schemaValid) {
    return Object.freeze({
      projectEvidencePass: false,
      manifestSchemaValid: false,
      checkedFiles: Object.freeze([]),
      verificationFailures: Object.freeze([
        verificationFailure("manifest.schema", "Manifest must be schema-valid before project evidence can be resolved.", "manifest")
      ]),
      commandsExecuted: false,
      limitations: Object.freeze(["No build, test, browser, or manifest command was executed."])
    });
  }
  const lexicalRoot = resolve(projectRoot);
  let canonicalRoot;
  try {
    canonicalRoot = await realpath(lexicalRoot);
  } catch (error) {
    return Object.freeze({
      projectEvidencePass: false,
      manifestSchemaValid: true,
      checkedFiles: Object.freeze([]),
      verificationFailures: Object.freeze([
        verificationFailure("root.missing", "Declared project root does not exist.", "project-root", { systemCode: error?.code || "UNKNOWN" })
      ]),
      commandsExecuted: false,
      limitations: Object.freeze(["No build, test, browser, or manifest command was executed."])
    });
  }
  const checks = await Promise.all(projectReferences(manifest).map((reference) => (
    checkReference(reference, lexicalRoot, canonicalRoot)
  )));
  const checkedFiles = Object.freeze(checks.flatMap(({ checked }) => checked ? [checked] : []));
  const verificationFailures = Object.freeze(checks.flatMap(({ failure }) => failure ? [failure] : []));
  return Object.freeze({
    projectEvidencePass: verificationFailures.length === 0,
    manifestSchemaValid: true,
    manifestLintPass: lint.manifestLintPass,
    checkedFiles,
    verificationFailures,
    commandsExecuted: false,
    limitations: Object.freeze([
      "Only containment, regular-file existence, byte size, and SHA-256 were checked.",
      "The manifest buildCommand and all other commands are descriptive only and were not executed.",
      "Browser behavior, accessibility, performance, visual quality, and legal rights still need their dedicated gates."
    ])
  });
}

async function main() {
  const [manifestArgument, rootArgument] = process.argv.slice(2);
  if (!manifestArgument) {
    throw new Error("Usage: node /absolute/path/to/scripts/verify-project.mjs <design-manifest.json> [project-root]");
  }
  const manifestPath = resolve(process.cwd(), manifestArgument);
  const projectRoot = rootArgument ? resolve(process.cwd(), rootArgument) : dirname(manifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const result = await verifyProjectArtifacts(manifest, projectRoot);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = result.projectEvidencePass ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
