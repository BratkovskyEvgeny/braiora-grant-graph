import duckdb from "duckdb";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type OggDatabase = {
  db: duckdb.Database;
  exec: (sql: string) => Promise<void>;
  all: <T = Record<string, unknown>>(sql: string) => Promise<T[]>;
  close: () => Promise<void>;
};

function run(db: duckdb.Database, sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function allRows<T>(db: duckdb.Database, sql: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows as T[])));
  });
}

export async function openOggDatabase(path: string): Promise<OggDatabase> {
  mkdirSync(dirname(path), { recursive: true });
  const db = new duckdb.Database(path);

  const exec = (sql: string) => run(db, sql);
  const all = <T = Record<string, unknown>>(sql: string) => allRows<T>(db, sql);
  const close = () =>
    new Promise<void>((resolve, reject) => {
      db.close((err) => (err ? reject(err) : resolve()));
    });

  await exec(`
    CREATE TABLE IF NOT EXISTS programs (
      id VARCHAR PRIMARY KEY,
      ecosystem VARCHAR NOT NULL,
      name VARCHAR NOT NULL,
      instrument VARCHAR NOT NULL,
      focus_categories VARCHAR[] NOT NULL,
      typical_min DOUBLE,
      typical_max DOUBLE,
      typical_median DOUBLE,
      url VARCHAR,
      status VARCHAR NOT NULL,
      notes VARCHAR,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS awards (
      id VARCHAR PRIMARY KEY,
      program_id VARCHAR NOT NULL,
      ecosystem VARCHAR NOT NULL,
      project_name VARCHAR NOT NULL,
      focus_categories VARCHAR[] NOT NULL,
      native_amount DOUBLE,
      native_asset VARCHAR,
      usd_estimate DOUBLE,
      priced_at TIMESTAMP,
      confidence VARCHAR NOT NULL,
      awarded_at TIMESTAMP,
      source_url VARCHAR,
      evidence VARCHAR
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id VARCHAR PRIMARY KEY,
      program_id VARCHAR NOT NULL,
      ecosystem VARCHAR NOT NULL,
      title VARCHAR NOT NULL,
      instrument VARCHAR NOT NULL,
      deadline_at TIMESTAMP,
      url VARCHAR,
      requirements VARCHAR[] NOT NULL,
      focus_categories VARCHAR[] NOT NULL,
      usd_estimate DOUBLE,
      discovered_at TIMESTAMP NOT NULL
    );
  `);

  return { db, exec, all, close };
}
