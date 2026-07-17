import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { resolve } from "node:path";
import { seedPrograms } from "@ogg/collectors";
import type { ProjectProfile } from "@ogg/schema";
import { openOggDatabase, scoreOpportunityFit } from "@ogg/sdk";

const host = process.env.OGG_API_HOST ?? "127.0.0.1";
const port = Number(process.env.OGG_API_PORT ?? 8787);
const dbPath =
  process.env.OGG_DUCKDB_PATH ??
  resolve(process.cwd(), "../../data/ogg.duckdb");

const app = new Hono();

app.get("/health", (c) =>
  c.json({ ok: true, service: "braiora-grants-api", dbPath }),
);

app.get("/v1/programs", async (c) => {
  const ogg = await openOggDatabase(dbPath);
  try {
    const rows = await ogg.all("SELECT * FROM programs ORDER BY ecosystem, name");
    return c.json({ count: rows.length, items: rows });
  } finally {
    await ogg.close();
  }
});

app.get("/v1/opportunities", async (c) => {
  const ogg = await openOggDatabase(dbPath);
  try {
    const rows = await ogg.all(
      "SELECT * FROM opportunities ORDER BY discovered_at DESC",
    );
    return c.json({ count: rows.length, items: rows });
  } finally {
    await ogg.close();
  }
});

app.get("/v1/awards", async (c) => {
  const ogg = await openOggDatabase(dbPath);
  try {
    const ecosystem = c.req.query("ecosystem");
    const sql = ecosystem
      ? `SELECT * FROM awards WHERE ecosystem = '${ecosystem.replace(/'/g, "''")}' ORDER BY native_amount DESC NULLS LAST`
      : "SELECT * FROM awards ORDER BY awarded_at DESC NULLS LAST";
    const rows = await ogg.all(sql);
    return c.json({ count: rows.length, items: rows });
  } finally {
    await ogg.close();
  }
});

app.get("/v1/ecosystems/optimism/summary", async (c) => {
  const ogg = await openOggDatabase(dbPath);
  try {
    const rows = await ogg.all<{
      program_id: string;
      awards: number;
      op_sum: number;
      op_max: number;
      op_median: number;
    }>(`
      SELECT
        program_id,
        COUNT(*)::INT AS awards,
        COALESCE(SUM(native_amount), 0) AS op_sum,
        COALESCE(MAX(native_amount), 0) AS op_max,
        COALESCE(MEDIAN(native_amount), 0) AS op_median
      FROM awards
      WHERE ecosystem = 'optimism' AND native_asset = 'OP'
      GROUP BY program_id
      ORDER BY program_id
    `);
    return c.json({ ecosystem: "optimism", programs: rows });
  } finally {
    await ogg.close();
  }
});

app.post("/v1/score", async (c) => {
  const body = (await c.req.json()) as {
    project: ProjectProfile;
    programId: string;
  };

  const program = seedPrograms.find((p) => p.id === body.programId);
  if (!program) {
    return c.json({ error: "program_not_found", programId: body.programId }, 404);
  }

  return c.json({
    programId: program.id,
    fit: scoreOpportunityFit({ project: body.project, program }),
  });
});

console.log(`braiora-grants api on http://${host}:${port}`);
serve({ fetch: app.fetch, hostname: host, port });
