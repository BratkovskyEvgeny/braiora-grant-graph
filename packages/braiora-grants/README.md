# braiora-grants

Small JS library from [Braiora](https://braiora.com): types for grant programs + a plain scoring function (no ML, you can read the formula).

```bash
npm i braiora-grants zod
```

```js
import { scoreOpportunityFit } from "braiora-grants";

const fit = scoreOpportunityFit({
  project: {
    name: "my-tool",
    ecosystems: ["optimism"],
    focusCategories: ["developer_tooling"],
    isOpenSource: true,
    hasPublicSdk: true,
    externalIntegrators: 0,
    hasReproducibleDataset: false,
    stage: "mvp",
  },
  program: {
    id: "optimism-retro-devtools",
    ecosystem: "optimism",
    name: "Optimism Retro Funding — Dev Tooling",
    instrument: "retro_funding",
    focusCategories: ["developer_tooling"],
    url: "https://atlas.optimism.io/",
    status: "rolling",
    updatedAt: new Date().toISOString(),
  },
});

console.log(fit.score, fit.reasons);
```

Collectors / DuckDB live in the monorepo, not in this package.

MIT
