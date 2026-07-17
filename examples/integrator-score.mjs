/**
 * pnpm example:integrator
 */
import { scoreOpportunityFit } from "../packages/braiora-grants/dist/index.js";

const result = scoreOpportunityFit({
  project: {
    name: "partner-bot",
    ecosystems: ["optimism", "base"],
    focusCategories: ["developer_tooling", "analytics_transparency"],
    isOpenSource: true,
    hasPublicSdk: true,
    externalIntegrators: 1,
    hasReproducibleDataset: false,
    stage: "mvp",
  },
  program: {
    id: "optimism-retro-devtools",
    ecosystem: "optimism",
    name: "Optimism Retro Funding — Dev Tooling",
    instrument: "retro_funding",
    focusCategories: ["developer_tooling"],
    typicalCheckUsd: { min: 5000, max: 150000, medianHint: 20000 },
    url: "https://atlas.optimism.io/",
    status: "rolling",
    updatedAt: new Date().toISOString(),
  },
});

console.log(JSON.stringify(result, null, 2));
