import { format, type SqlLanguage } from "sql-formatter";
import type { TextResult } from "../types";

export const DIALECTS: { id: SqlLanguage; label: string }[] = [
  { id: "sql", label: "Standard SQL" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "sqlite", label: "SQLite" },
  { id: "transactsql", label: "SQL Server" },
  { id: "plsql", label: "Oracle" },
  { id: "bigquery", label: "BigQuery" },
  { id: "snowflake", label: "Snowflake" },
];

export type KeywordCase = "upper" | "lower" | "preserve";

export function formatSql(sql: string, language: SqlLanguage, keywordCase: KeywordCase): TextResult {
  try {
    return { ok: true, output: format(sql, { language, keywordCase, tabWidth: 2 }) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message.split("\n")[0] : String(error) };
  }
}
