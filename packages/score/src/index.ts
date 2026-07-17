import type {
  Opportunity,
  Program,
  ProjectProfile,
} from "../../schema/src/index.js";

export type FitBreakdown = {
  categoryOverlap: number;
  ecosystemMatch: number;
  openSourceAlignment: number;
  maturity: number;
  checkAttractiveness: number;
};

export type FitResult = {
  score: number;
  breakdown: FitBreakdown;
  reasons: string[];
};

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Transparent, explainable fit score (0–100). No black-box model. */
export function scoreOpportunityFit(input: {
  project: ProjectProfile;
  program: Program;
  opportunity?: Opportunity;
}): FitResult {
  const { project, program, opportunity } = input;
  const focus = opportunity?.focusCategories?.length
    ? opportunity.focusCategories
    : program.focusCategories;

  const overlap =
    focus.length === 0
      ? 0.4
      : focus.filter((c) => project.focusCategories.includes(c)).length /
        focus.length;

  const ecosystemMatch = project.ecosystems.includes(program.ecosystem)
    ? 1
    : project.ecosystems.includes("other")
      ? 0.4
      : 0.15;

  const openSourceAlignment = project.isOpenSource
    ? program.instrument === "retro_funding" ||
      program.instrument === "milestone_grant"
      ? 1
      : 0.85
    : 0.25;

  const maturityMap: Record<ProjectProfile["stage"], number> = {
    idea: 0.2,
    mvp: 0.55,
    shipped: 0.8,
    adopted: 1,
  };
  let maturity = maturityMap[project.stage];
  if (project.hasPublicSdk) maturity = clamp01(maturity + 0.1);
  if (project.externalIntegrators >= 3) maturity = clamp01(maturity + 0.1);
  if (project.hasReproducibleDataset) maturity = clamp01(maturity + 0.05);

  const hint =
    opportunity?.estimatedCheckUsd?.usdEstimate ??
    program.typicalCheckUsd?.medianHint ??
    program.typicalCheckUsd?.min ??
    null;
  const checkAttractiveness =
    hint == null ? 0.5 : hint >= 10_000 ? (hint >= 40_000 ? 1 : 0.8) : 0.35;

  const breakdown: FitBreakdown = {
    categoryOverlap: overlap,
    ecosystemMatch,
    openSourceAlignment,
    maturity,
    checkAttractiveness,
  };

  const score = Math.round(
    100 *
      (0.3 * breakdown.categoryOverlap +
        0.2 * breakdown.ecosystemMatch +
        0.2 * breakdown.openSourceAlignment +
        0.2 * breakdown.maturity +
        0.1 * breakdown.checkAttractiveness),
  );

  const reasons: string[] = [];
  if (breakdown.categoryOverlap >= 0.5)
    reasons.push("Focus categories overlap with historical payout themes");
  if (breakdown.ecosystemMatch >= 1)
    reasons.push(`Project already targets ${program.ecosystem}`);
  if (breakdown.openSourceAlignment >= 0.85)
    reasons.push("Open-source posture matches public-goods programs");
  if (project.stage === "idea")
    reasons.push("Stage is early — ship MVP before large applications");
  if (hint != null && hint >= 40_000)
    reasons.push("Program historically supports larger technical checks");

  return { score, breakdown, reasons };
}
