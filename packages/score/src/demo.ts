import type { Program, ProjectProfile } from "@ogg/schema";
import { scoreOpportunityFit } from "./index.js";

const project: ProjectProfile = {
  name: "Braiora Grant Graph",
  ecosystems: ["ethereum", "optimism", "solana"],
  focusCategories: ["developer_tooling", "indexing_data", "analytics_transparency"],
  isOpenSource: true,
  hasPublicSdk: true,
  externalIntegrators: 0,
  hasReproducibleDataset: true,
  stage: "mvp",
};

const program: Program = {
  id: "optimism-retro-devtools",
  ecosystem: "optimism",
  name: "Optimism Retro Funding — Dev Tooling",
  instrument: "retro_funding",
  focusCategories: ["developer_tooling"],
  typicalCheckUsd: { min: 10000, max: 150000, medianHint: 25000 },
  url: "https://optimism.io/blog/retro-funding-2025",
  status: "rolling",
  updatedAt: new Date().toISOString(),
};

console.log(JSON.stringify(scoreOpportunityFit({ project, program }), null, 2));
