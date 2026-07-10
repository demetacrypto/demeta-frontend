#!/usr/bin/env node
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const showcaseRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(showcaseRoot, "dist");
const index = join(dist, "index.html");
const routes = Object.freeze(["pressure-atlas", "vitreum", "foldline"]);

for (const route of routes) {
  const routeDirectory = join(dist, route);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(index, join(routeDirectory, "index.html"));
}

await Promise.all([
  copyFile(index, join(dist, "404.html")),
  writeFile(join(dist, ".nojekyll"), "")
]);

process.stdout.write(`Prepared GitHub Pages entry points for ${routes.length} interactive studies.\n`);
