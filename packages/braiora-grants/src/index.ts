/** npm entry for braiora-grants — schema + score only. */
export {
  SCHEMA_VERSION,
  AwardSchema,
  EcosystemSchema,
  FocusCategorySchema,
  FundingInstrumentSchema,
  MoneySchema,
  OpportunitySchema,
  ProgramSchema,
  ProjectProfileSchema,
  type Award,
  type Ecosystem,
  type FocusCategory,
  type FundingInstrument,
  type Money,
  type Opportunity,
  type Program,
  type ProjectProfile,
} from "../../schema/src/index.js";

export {
  scoreOpportunityFit,
  type FitBreakdown,
  type FitResult,
} from "../../score/src/index.js";
