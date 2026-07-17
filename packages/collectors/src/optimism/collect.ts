import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openOggDatabase } from "@ogg/sdk";
import { upsertAward, upsertOpportunity, upsertProgram } from "../lib/upsert.js";
import { parseRetroResults, type RetroResultRow } from "./parse.js";
import { optimismOpportunities, optimismPrograms } from "./programs.js";
import {
  defaultOptimismSnapshots,
  snapshotUrl,
  type OptimismSnapshot,
} from "./sources.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

export type CollectOptimismOptions = {
  dbPath?: string;
  rawDir?: string;
  snapshots?: OptimismSnapshot[];
  /** Keep only top-N awards per snapshot by OP amount (default: all). */
  topN?: number;
};

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "braiora-grants/0.1 (+https://braiora.com)",
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} for ${url}`);
  }
  return res.json();
}

export async function collectOptimism(
  options: CollectOptimismOptions = {},
): Promise<{
  dbPath: string;
  snapshots: unknown[];
  awardsUpserted: number;
}> {
  const dbPath =
    options.dbPath ??
    process.env.OGG_DUCKDB_PATH ??
    resolve(repoRoot, "data/ogg.duckdb");
  const rawDir = options.rawDir ?? resolve(repoRoot, "data/raw/optimism");
  const snapshots = options.snapshots ?? defaultOptimismSnapshots;

  mkdirSync(rawDir, { recursive: true });
  const ogg = await openOggDatabase(dbPath);

  try {
    for (const program of optimismPrograms) {
      await upsertProgram(ogg, {
        ...program,
        updatedAt: new Date().toISOString(),
      });
    }
    for (const opp of optimismOpportunities()) {
      await upsertOpportunity(ogg, opp);
    }

    let awardsUpserted = 0;
    const summary: unknown[] = [];

    for (const snapshot of snapshots) {
      const url = snapshotUrl(snapshot);
      const json = (await fetchJson(url)) as RetroResultRow[];
      if (!Array.isArray(json)) {
        throw new Error(`Expected array from ${url}`);
      }

      const rawFile = resolve(
        rawDir,
        `S${snapshot.season}_${snapshot.period}_${snapshot.track}.json`,
      );
      writeFileSync(rawFile, JSON.stringify(json, null, 2));

      let { awards, stats } = parseRetroResults(json, snapshot);
      if (options.topN != null) {
        awards = [...awards]
          .sort(
            (a, b) =>
              (b.amount.nativeAmount ?? 0) - (a.amount.nativeAmount ?? 0),
          )
          .slice(0, options.topN);
      }

      for (const award of awards) {
        await upsertAward(ogg, award);
        awardsUpserted += 1;
      }

      summary.push({ ...stats, source: url, rawFile, storedAwards: awards.length });
      console.log(
        `Optimism S${snapshot.season}/${snapshot.period}/${snapshot.track}: ` +
          `${stats.rewarded} rewarded / ${stats.total} rows, median=${stats.opMedian} OP, max=${stats.opMax} OP`,
      );
    }

    const summaryPath = resolve(rawDir, "collect-summary.json");
    writeFileSync(
      summaryPath,
      JSON.stringify(
        { collectedAt: new Date().toISOString(), snapshots: summary },
        null,
        2,
      ),
    );

    return { dbPath, snapshots: summary, awardsUpserted };
  } finally {
    await ogg.close();
  }
}
