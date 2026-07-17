export function sqlStr(v: string | null | undefined): string {
  if (v == null) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

export function sqlNum(v: number | null | undefined): string {
  return v == null || Number.isNaN(v) ? "NULL" : String(v);
}

export function sqlTs(v: string | null | undefined): string {
  if (v == null) return "NULL";
  return `TIMESTAMP '${v.replace("T", " ").replace("Z", "")}'`;
}

export function sqlArr(items: string[]): string {
  if (items.length === 0) return "CAST([] AS VARCHAR[])";
  return `[${items.map((i) => sqlStr(i)).join(", ")}]`;
}
