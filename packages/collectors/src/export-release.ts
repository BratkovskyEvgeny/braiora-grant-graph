import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openOggDatabase } from "@ogg/sdk";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

async function main() {
  const stamp = new Date().toISOString().slice(0, 10);
  const dbPath =
    process.env.OGG_DUCKDB_PATH ?? resolve(repoRoot, "data/ogg.duckdb");
  const outDir = resolve(repoRoot, "data/releases", stamp);
  mkdirSync(outDir, { recursive: true });

  const ogg = await openOggDatabase(dbPath);
  try {
    const targets = [
      ["programs", "programs.jsonl"],
      ["awards", "awards.jsonl"],
      ["opportunities", "opportunities.jsonl"],
    ] as const;

    for (const [table, file] of targets) {
      const path = resolve(outDir, file);
      await ogg.exec(
        `COPY (SELECT * FROM ${table}) TO '${path.replace(/'/g, "''")}' (FORMAT JSON, ARRAY false)`,
      );
    }

    const summary = await ogg.all<{
      table_name: string;
      n: number;
    }>(`
      SELECT 'programs' AS table_name, COUNT(*)::INT AS n FROM programs
      UNION ALL
      SELECT 'awards', COUNT(*)::INT FROM awards
      UNION ALL
      SELECT 'opportunities', COUNT(*)::INT FROM opportunities
      UNION ALL
      SELECT 'awards_optimism', COUNT(*)::INT FROM awards WHERE ecosystem = 'optimism'
    `);

    const counts = Object.fromEntries(summary.map((r) => [r.table_name, r.n]));
    const manifest = {
      release_date: stamp,
      schema_version: "0.1.0",
      product: "braiora-grants",
      brand: "Braiora",
      primary_source: "optimism-retro-funding-github",
      counts,
    };
    writeFileSync(resolve(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

    console.log(JSON.stringify({ outDir, dbPath, ...manifest }, null, 2));
  } finally {
    await ogg.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
