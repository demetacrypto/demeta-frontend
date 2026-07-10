# Asset provenance

Every shipped image, video, font, icon, model, shader source, audio file, texture, dataset, and generated derivative needs a traceable right-to-use record.

## Allowed source types

- `original-code`: authored in the project; record creator, path, license, and SHA-256.
- `generated`: created with an approved generation tool; retain final `prompt`, `generator`, `generatedAt`, creator/controller, output path, SPDX or `LicenseRef-*` identifier, and SHA-256.
- `owned`: supplied by the user/organization; record an `ownershipNote` and path without exposing private metadata.
- `licensed`: record `sourceUrl`, author/rightsholder, exact SPDX or `LicenseRef-*` identifier, `licenseUrl`, attribution, restrictions, and SHA-256.

Unknown, "found online," screenshot-derived, copied-template, gated-prompt, and unlicensed assets cannot ship.

## Asset manifest

Use a project-level record such as:

```json
{
  "id": "pressure-specimen-47",
  "type": "generated-raster",
  "source": "generated",
  "creator": "project team",
  "path": "public/assets/specimen-47.webp",
  "license": "CC0-1.0",
  "prompt": "final normalized prompt",
  "generator": "built-in image generation",
  "generatedAt": "YYYY-MM-DD",
  "sha256": "64 lowercase hexadecimal characters"
}
```

For licensed assets, add `sourceUrl`, `licenseUrl`, and `attribution`. If a custom license is necessary, use a stable `LicenseRef-*` identifier and retain the full license beside the project even though that extra file is not embedded in the manifest object.

## Generated media

- Generate from the brief, not from a living artist's name or a protected brand's distinctive campaign.
- Do not ask for logos, trademarks, celebrity likenesses, copyrighted characters, or copied product trade dress.
- Keep required text in semantic HTML rather than inside generated imagery whenever possible.
- Inspect for accidental marks, unreadable text, duplicated anatomy/objects, false evidence, and wrong-medium output.
- Integrate the asset through crop, mask, depth, layout, or interaction; a generated image placed beside a headline is not art direction.
- Keep the final selected prompt and file; discarded drafts need not ship.

## Fonts and libraries

- Prefer system fonts or explicitly licensed families.
- Vendor font license files when fonts are shipped.
- Record third-party packages in the lockfile and retain their licenses through normal package distribution.
- Do not copy example code or shaders without checking their license and attribution requirements.

## Redistribution guard

Do not publish scraped competitor catalogs, template names, prompt bodies, screenshots, gated content, or datasets without documented redistribution rights. Replace them with an original, brand-neutral taxonomy and independently authored fixtures.

## Hashing

Generate hashes from the project root with a local command such as:

```bash
shasum -a 256 path/to/asset
```

Hashes establish artifact identity, not ownership; keep both rights metadata and the hash.
