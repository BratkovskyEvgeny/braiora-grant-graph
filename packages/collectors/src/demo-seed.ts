import { openOggDatabase } from "@ogg/sdk";
import { resolve } from "node:path";
import {
  seedAwards,
  seedOpportunities,
  seedPrograms,
} from "./seed-programs.js";

const dbPath =
  process.env.OGG_DUCKDB_PATH ??
  resolve(process.cwd(), "../../data/ogg.duckdb");

function sqlStr(v: string | null | undefined): string {
  if (v == null) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

function sqlNum(v: number | null | undefined): string {
  return v == null ? "NULL" : String(v);
}

function sqlTs(v: string | null | undefined): string {
  if (v == null) return "NULL";
  return `TIMESTAMP '${v.replace("T", " ").replace("Z", "")}'`;
}

function sqlArr(items: string[]): string {
  if (items.length === 0) return "[]";
  return `[${items.map((i) => sqlStr(i)).join(", ")}]`;
}

async function main() {
  const ogg = await openOggDatabase(dbPath);

  await ogg.exec("DELETE FROM opportunities");
  await ogg.exec("DELETE FROM awards");
  await ogg.exec("DELETE FROM programs");

  for (const p of seedPrograms) {
    await ogg.exec(`
      INSERT INTO programs VALUES (
        ${sqlStr(p.id)},
        ${sqlStr(p.ecosystem)},
        ${sqlStr(p.name)},
        ${sqlStr(p.instrument)},
        ${sqlArr(p.focusCategories)},
        ${sqlNum(p.typicalCheckUsd?.min ?? null)},
        ${sqlNum(p.typicalCheckUsd?.max ?? null)},
        ${sqlNum(p.typicalCheckUsd?.medianHint ?? null)},
        ${sqlStr(p.url)},
        ${sqlStr(p.status)},
        ${sqlStr(p.notes ?? null)},
        ${sqlTs(p.updatedAt)}
      );
    `);
  }

  for (const a of seedAwards) {
    await ogg.exec(`
      INSERT INTO awards VALUES (
        ${sqlStr(a.id)},
        ${sqlStr(a.programId)},
        ${sqlStr(a.ecosystem)},
        ${sqlStr(a.projectName)},
        ${sqlArr(a.focusCategories)},
        ${sqlNum(a.amount.nativeAmount)},
        ${sqlStr(a.amount.nativeAsset)},
        ${sqlNum(a.amount.usdEstimate)},
        ${sqlTs(a.amount.pricedAt)},
        ${sqlStr(a.amount.confidence)},
        ${sqlTs(a.awardedAt)},
        ${sqlStr(a.sourceUrl)},
        ${sqlStr(a.evidence ?? null)}
      );
    `);
  }

  for (const o of seedOpportunities) {
    await ogg.exec(`
      INSERT INTO opportunities VALUES (
        ${sqlStr(o.id)},
        ${sqlStr(o.programId)},
        ${sqlStr(o.ecosystem)},
        ${sqlStr(o.title)},
        ${sqlStr(o.instrument)},
        ${sqlTs(o.deadlineAt)},
        ${sqlStr(o.url)},
        ${sqlArr(o.requirements)},
        ${sqlArr(o.focusCategories)},
        ${sqlNum(o.estimatedCheckUsd?.usdEstimate ?? null)},
        ${sqlTs(o.discoveredAt)}
      );
    `);
  }

  const programs = await ogg.all<{ count: number }>(
    "SELECT COUNT(*)::INT AS count FROM programs",
  );
  const awards = await ogg.all<{ count: number }>(
    "SELECT COUNT(*)::INT AS count FROM awards",
  );
  const opps = await ogg.all<{ count: number }>(
    "SELECT COUNT(*)::INT AS count FROM opportunities",
  );

  console.log(
    JSON.stringify(
      {
        dbPath,
        programs: programs[0]?.count ?? 0,
        awards: awards[0]?.count ?? 0,
        opportunities: opps[0]?.count ?? 0,
      },
      null,
      2,
    ),
  );

  await ogg.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
