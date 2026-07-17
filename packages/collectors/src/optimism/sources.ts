export type OptimismTrack = "devtooling" | "onchain";

export type OptimismSnapshot = {
  season: number;
  period: string;
  track: OptimismTrack;
  /** Path under ethereum-optimism/Retro-Funding */
  repoPath: string;
  awardedAt: string;
};

const RAW_BASE =
  "https://raw.githubusercontent.com/ethereum-optimism/Retro-Funding/main";

/** Curated high-signal snapshots (final S7 + latest known S8). */
export const defaultOptimismSnapshots: OptimismSnapshot[] = [
  {
    season: 7,
    period: "M6",
    track: "devtooling",
    repoPath: "results/S7/M6/outputs/devtooling__results.json",
    awardedAt: "2025-08-01T00:00:00.000Z",
  },
  {
    season: 7,
    period: "M6",
    track: "onchain",
    repoPath: "results/S7/M6/outputs/onchain__results.json",
    awardedAt: "2025-08-01T00:00:00.000Z",
  },
  {
    season: 8,
    period: "M11",
    track: "devtooling",
    repoPath: "results/S8/M11/outputs/devtooling__results.json",
    awardedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    season: 8,
    period: "M11",
    track: "onchain",
    repoPath: "results/S8/M11/outputs/onchain__results.json",
    awardedAt: "2026-01-01T00:00:00.000Z",
  },
];

export function snapshotUrl(snapshot: OptimismSnapshot): string {
  return `${RAW_BASE}/${snapshot.repoPath}`;
}

export function programIdForTrack(track: OptimismTrack): string {
  return track === "devtooling"
    ? "optimism-retro-devtools"
    : "optimism-retro-onchain-builders";
}
