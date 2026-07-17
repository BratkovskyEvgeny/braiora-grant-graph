import type { Opportunity, Program } from "@ogg/schema";

const now = () => new Date().toISOString();

export const optimismPrograms: Program[] = [
  {
    id: "optimism-retro-devtools",
    ecosystem: "optimism",
    name: "Optimism Retro Funding — Dev Tooling",
    instrument: "retro_funding",
    focusCategories: ["developer_tooling"],
    // Hints are rough USD; authoritative sizes are in OP (see awards). S7/M6 median ≈ 7.8k OP among rewarded.
    typicalCheckUsd: { min: 5000, max: 150000, medianHint: 20000 },
    url: "https://gov.optimism.io/t/retro-funding-dev-tooling-mission-details/9598",
    status: "rolling",
    notes:
      "Rewards OSS toolchain. Source: ethereum-optimism/Retro-Funding (not Agora). S7/M6: ~93 rewarded, median≈7772 OP, max=78000 OP. Register on OP Atlas.",
    updatedAt: now(),
  },
  {
    id: "optimism-retro-onchain-builders",
    ecosystem: "optimism",
    name: "Optimism Retro Funding — Onchain Builders",
    instrument: "retro_funding",
    focusCategories: ["defi_primitive", "ux_wallets", "infrastructure_rpc"],
    typicalCheckUsd: { min: 500, max: 80000, medianHint: 8000 },
    url: "https://gov.optimism.io/t/retro-funding-onchain-builders-mission-details/9611",
    status: "rolling",
    notes:
      "Onchain Superchain growth. Source: Retro-Funding JSON. S7/M6: median≈3194 OP among rewarded, max=65000 OP. Needs verified contracts on eligible OP chains.",
    updatedAt: now(),
  },
];

export function optimismOpportunities(): Opportunity[] {
  const discoveredAt = now();
  return [
    {
      id: "opp-op-retro-devtools-atlas",
      programId: "optimism-retro-devtools",
      ecosystem: "optimism",
      title: "OP Atlas — enroll Dev Tooling for Retro Funding",
      instrument: "retro_funding",
      deadlineAt: null,
      url: "https://atlas.optimism.io/",
      requirements: [
        "Public GitHub with commit history",
        "Verify GitHub ownership in OP Atlas",
        "Publish npm or crates package when applicable",
        "≥3 Superchain builder dependents with material L2 gas (JS/Rust packages)",
        "Open source license",
      ],
      focusCategories: ["developer_tooling"],
      estimatedCheckUsd: {
        nativeAmount: 7772,
        nativeAsset: "OP",
        usdEstimate: null,
        pricedAt: null,
        confidence: "medium",
      },
      discoveredAt,
    },
    {
      id: "opp-op-retro-onchain-atlas",
      programId: "optimism-retro-onchain-builders",
      ecosystem: "optimism",
      title: "OP Atlas — enroll Onchain Builders for Retro Funding",
      instrument: "retro_funding",
      deadlineAt: null,
      url: "https://atlas.optimism.io/",
      requirements: [
        "Verified contract on eligible OP Chain",
        "Minimum onchain activity thresholds",
        "DeFiLlama adapter for DeFi projects",
      ],
      focusCategories: ["defi_primitive"],
      estimatedCheckUsd: {
        nativeAmount: 5000,
        nativeAsset: "OP",
        usdEstimate: null,
        pricedAt: null,
        confidence: "low",
      },
      discoveredAt,
    },
  ];
}
