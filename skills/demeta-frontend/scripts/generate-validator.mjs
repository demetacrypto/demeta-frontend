#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";

const schemaPath = new URL("../references/design-manifest.schema.json", import.meta.url);
const outputPath = new URL("./generated/design-manifest-validator.mjs", import.meta.url);
const schema = JSON.parse(await readFile(schemaPath, "utf8"));
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  strictRequired: false,
  code: { source: true, esm: true, lines: true }
});
const validate = ajv.compile(schema);
let source = standaloneCode(ajv, validate);

source = source
  .replace(
    'const func1 = require("ajv/dist/runtime/ucs2length").default;',
    `function func1(str) {\n  const len = str.length;\n  let length = 0;\n  let pos = 0;\n  while (pos < len) {\n    length += 1;\n    let value = str.charCodeAt(pos++);\n    if (value >= 0xd800 && value <= 0xdbff && pos < len) {\n      value = str.charCodeAt(pos);\n      if ((value & 0xfc00) === 0xdc00) pos += 1;\n    }\n  }\n  return length;\n}`
  )
  .replace(
    'const func0 = require("ajv/dist/runtime/equal").default;',
    `function func0(a, b) {\n  if (a === b) return true;\n  if (a && b && typeof a === "object" && typeof b === "object") {\n    if (a.constructor !== b.constructor) return false;\n    if (Array.isArray(a)) {\n      if (a.length !== b.length) return false;\n      for (let index = a.length; index-- !== 0;) {\n        if (!func0(a[index], b[index])) return false;\n      }\n      return true;\n    }\n    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;\n    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();\n    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();\n    const keys = Object.keys(a);\n    if (keys.length !== Object.keys(b).length) return false;\n    for (let index = keys.length; index-- !== 0;) {\n      if (!Object.prototype.hasOwnProperty.call(b, keys[index])) return false;\n    }\n    for (let index = keys.length; index-- !== 0;) {\n      const key = keys[index];\n      if (!func0(a[key], b[key])) return false;\n    }\n    return true;\n  }\n  return a !== a && b !== b;\n}`
  );

if (/require\(|from\s+["']ajv/.test(source)) {
  throw new Error("Generated validator retained an Ajv runtime dependency.");
}

const banner = "// Generated from references/design-manifest.schema.json with Ajv 8.20.0. Do not edit by hand.\n";
await mkdir(new URL(".", outputPath), { recursive: true });
await writeFile(outputPath, `${banner}${source}`);
