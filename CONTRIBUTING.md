# Contributing

Contributions should improve transferable design reasoning, accessibility, performance, provenance, or evaluator coverage without creating a new house template.

Before opening a pull request:

```bash
npm ci
npx playwright install chromium
npm run verify:release
```

For skill changes:

- keep `SKILL.md` under 350 lines;
- route detail into one-level references;
- add a failing fixture/test before changing the evaluator;
- regenerate the committed standalone validator after every schema edit and commit the result;
- include a legitimate control so anti-template checks do not reject good static work;
- do not weaken accessibility, truth, provenance, or performance hard gates to raise a score.

For visual changes:

- update the relevant manifest and browser evidence;
- explain the niche signal and signature interaction;
- verify desktop, mobile, 200% text zoom, 320 px reflow, complete keyboard activation, reduced motion, and no-WebGL;
- never update screenshots automatically without reviewing the rendered change.
