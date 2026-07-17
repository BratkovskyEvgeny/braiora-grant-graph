import type { Award, FocusCategory } from "@ogg/schema";
import {
  programIdForTrack,
  type OptimismSnapshot,
  type OptimismTrack,
} from "./sources.js";

export type RetroResultRow = {
  op_atlas_id?: string;
  display_name?: string;
  is_eligible?: boolean;
  op_reward?: number | null;
  star_count?: number;
  fork_count?: number;
  package_connection_count?: number;
  developer_connection_count?: number;
};

export type SnapshotStats = {
  season: number;
  period: string;
  track: OptimismTrack;
  total: number;
  eligible: number;
  rewarded: number;
  opSum: number;
  opMax: number;
  opMedian: number;
};

function focusForTrack(track: OptimismTrack): FocusCategory[] {
  return track === "devtooling" ? ["developer_tooling"] : ["defi_primitive"];
}

export function parseRetroResults(
  rows: RetroResultRow[],
  snapshot: OptimismSnapshot,
): { awards: Award[]; stats: SnapshotStats } {
  const programId = programIdForTrack(snapshot.track);
  const sourceUrl = `https://github.com/ethereum-optimism/Retro-Funding/blob/main/${snapshot.repoPath}`;
  const rewards = rows
    .map((r) => Number(r.op_reward ?? 0))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);

  const awards: Award[] = [];
  for (const row of rows) {
    const amount = Number(row.op_reward ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    const atlasId = row.op_atlas_id ?? "unknown";
    const name = row.display_name?.trim() || atlasId;
    awards.push({
      id: `op-s${snapshot.season}-${snapshot.period.toLowerCase()}-${snapshot.track}-${atlasId}`,
      programId,
      ecosystem: "optimism",
      projectName: name,
      focusCategories: focusForTrack(snapshot.track),
      amount: {
        nativeAmount: amount,
        nativeAsset: "OP",
        usdEstimate: null,
        pricedAt: null,
        confidence: "high",
      },
      awardedAt: snapshot.awardedAt,
      sourceUrl,
      evidence: [
        `eligible=${Boolean(row.is_eligible)}`,
        row.package_connection_count != null
          ? `package_connections=${row.package_connection_count}`
          : null,
        row.developer_connection_count != null
          ? `developer_connections=${row.developer_connection_count}`
          : null,
        row.star_count != null ? `stars=${row.star_count}` : null,
      ]
        .filter(Boolean)
        .join("; "),
    });
  }

  const stats: SnapshotStats = {
    season: snapshot.season,
    period: snapshot.period,
    track: snapshot.track,
    total: rows.length,
    eligible: rows.filter((r) => r.is_eligible).length,
    rewarded: rewards.length,
    opSum: rewards.reduce((a, b) => a + b, 0),
    opMax: rewards.length ? rewards[rewards.length - 1]! : 0,
    opMedian: rewards.length ? rewards[Math.floor(rewards.length / 2)]! : 0,
  };

  return { awards, stats };
}
