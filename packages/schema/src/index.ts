import { z } from "zod";

/** High-level funding instrument type (what foundations actually run). */
export const FundingInstrumentSchema = z.enum([
  "milestone_grant",
  "retro_funding",
  "microgrant",
  "rfp",
  "hackathon_prize",
  "incentive_program",
  "research_grant",
  "accelerator",
  "other",
]);
export type FundingInstrument = z.infer<typeof FundingInstrumentSchema>;

/** What large checks historically funded. */
export const FocusCategorySchema = z.enum([
  "protocol_clients",
  "zk_cryptography",
  "security",
  "developer_tooling",
  "indexing_data",
  "analytics_transparency",
  "defi_primitive",
  "ux_wallets",
  "privacy",
  "education_community",
  "governance",
  "infrastructure_rpc",
  "other",
]);
export type FocusCategory = z.infer<typeof FocusCategorySchema>;

export const EcosystemSchema = z.enum([
  "ethereum",
  "optimism",
  "base",
  "arbitrum",
  "solana",
  "avalanche",
  "sui",
  "aptos",
  "near",
  "other",
]);
export type Ecosystem = z.infer<typeof EcosystemSchema>;

export const MoneySchema = z.object({
  /** Amount in native unit if paid in token (e.g. OP, ARB). */
  nativeAmount: z.number().nonnegative().nullable(),
  nativeAsset: z.string().nullable(),
  /** USD estimate at a known time; null if unknown. */
  usdEstimate: z.number().nonnegative().nullable(),
  pricedAt: z.string().datetime().nullable(),
  confidence: z.enum(["high", "medium", "low", "unknown"]).default("unknown"),
});
export type Money = z.infer<typeof MoneySchema>;

export const ProgramSchema = z.object({
  id: z.string().min(1),
  ecosystem: EcosystemSchema,
  name: z.string().min(1),
  instrument: FundingInstrumentSchema,
  focusCategories: z.array(FocusCategorySchema).default([]),
  typicalCheckUsd: z
    .object({
      min: z.number().nonnegative().nullable(),
      max: z.number().nonnegative().nullable(),
      medianHint: z.number().nonnegative().nullable(),
    })
    .partial()
    .optional(),
  url: z.string().url().nullable(),
  status: z.enum(["open", "closed", "rolling", "unknown"]).default("unknown"),
  notes: z.string().optional(),
  updatedAt: z.string().datetime(),
});
export type Program = z.infer<typeof ProgramSchema>;

export const AwardSchema = z.object({
  id: z.string().min(1),
  programId: z.string().min(1),
  ecosystem: EcosystemSchema,
  projectName: z.string().min(1),
  focusCategories: z.array(FocusCategorySchema).default([]),
  amount: MoneySchema,
  awardedAt: z.string().datetime().nullable(),
  sourceUrl: z.string().url().nullable(),
  evidence: z.string().optional(),
});
export type Award = z.infer<typeof AwardSchema>;

export const OpportunitySchema = z.object({
  id: z.string().min(1),
  programId: z.string().min(1),
  ecosystem: EcosystemSchema,
  title: z.string().min(1),
  instrument: FundingInstrumentSchema,
  deadlineAt: z.string().datetime().nullable(),
  url: z.string().url().nullable(),
  requirements: z.array(z.string()).default([]),
  focusCategories: z.array(FocusCategorySchema).default([]),
  estimatedCheckUsd: MoneySchema.optional(),
  discoveredAt: z.string().datetime(),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

export const ProjectProfileSchema = z.object({
  name: z.string().min(1),
  ecosystems: z.array(EcosystemSchema).default([]),
  focusCategories: z.array(FocusCategorySchema).default([]),
  isOpenSource: z.boolean().default(true),
  hasPublicSdk: z.boolean().default(false),
  externalIntegrators: z.number().int().nonnegative().default(0),
  hasReproducibleDataset: z.boolean().default(false),
  stage: z.enum(["idea", "mvp", "shipped", "adopted"]).default("mvp"),
});
export type ProjectProfile = z.infer<typeof ProjectProfileSchema>;

export const SCHEMA_VERSION = "0.1.0" as const;
