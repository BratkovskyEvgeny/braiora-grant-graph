import type { Award, Opportunity, Program } from "@ogg/schema";
import type { OggDatabase } from "@ogg/sdk";
import { sqlArr, sqlNum, sqlStr, sqlTs } from "./sql.js";

export async function upsertProgram(db: OggDatabase, p: Program): Promise<void> {
  await db.exec(`DELETE FROM programs WHERE id = ${sqlStr(p.id)}`);
  await db.exec(`
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

export async function upsertAward(db: OggDatabase, a: Award): Promise<void> {
  await db.exec(`DELETE FROM awards WHERE id = ${sqlStr(a.id)}`);
  await db.exec(`
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

export async function upsertOpportunity(
  db: OggDatabase,
  o: Opportunity,
): Promise<void> {
  await db.exec(`DELETE FROM opportunities WHERE id = ${sqlStr(o.id)}`);
  await db.exec(`
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
