import { describe, expect, it } from "vitest";
import { parseRetroResults } from "./parse.js";
import type { OptimismSnapshot } from "./sources.js";

const snapshot: OptimismSnapshot = {
  season: 7,
  period: "M6",
  track: "devtooling",
  repoPath: "results/S7/M6/outputs/devtooling__results.json",
  awardedAt: "2025-08-01T00:00:00.000Z",
};

describe("parseRetroResults", () => {
  it("keeps only positive OP rewards and builds stable ids", () => {
    const { awards, stats } = parseRetroResults(
      [
        {
          op_atlas_id: "0xabc",
          display_name: "LibA",
          is_eligible: true,
          op_reward: 1000,
          package_connection_count: 3,
        },
        {
          op_atlas_id: "0xdef",
          display_name: "LibB",
          is_eligible: true,
          op_reward: 0,
        },
        {
          op_atlas_id: "0xghi",
          display_name: "LibC",
          is_eligible: false,
          op_reward: 500,
        },
      ],
      snapshot,
    );

    expect(awards).toHaveLength(2);
    expect(awards[0]?.id).toBe("op-s7-m6-devtooling-0xabc");
    expect(awards[0]?.amount.nativeAsset).toBe("OP");
    expect(awards[0]?.programId).toBe("optimism-retro-devtools");
    expect(stats.rewarded).toBe(2);
    expect(stats.opMedian).toBe(1000);
    expect(stats.opMax).toBe(1000);
  });
});
