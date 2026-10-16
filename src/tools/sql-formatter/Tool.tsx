"use client";

import { useState } from "react";
import type { SqlLanguage } from "sql-formatter";
import { TransformTool } from "@/components/TransformTool";
import { DIALECTS, formatSql, type KeywordCase } from "./logic";

const SAMPLE =
  "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = true and o.created_at > '2026-01-01' group by u.id, u.name having count(o.id) > 2 order by orders desc limit 10;";

export default function SqlFormatter() {
  const [language, setLanguage] = useState<SqlLanguage>("sql");
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");

  return (
    <TransformTool
      id="sql"
      inputLabel="SQL"
      outputLabel="Formatted"
      sample={SAMPLE}
      idle="Paste a query, pick its dialect, then press Format."
      actions={[{ label: "Format", done: "Formatted the SQL.", problem: "That couldn't be formatted.", run: (input) => formatSql(input, language, keywordCase) }]}
    >
      <label>
        Dialect{" "}
        <select value={language} onChange={(event) => setLanguage(event.target.value as SqlLanguage)}>
          {DIALECTS.map((dialect) => <option key={dialect.id} value={dialect.id}>{dialect.label}</option>)}
        </select>
      </label>
      <label>
        Keywords{" "}
        <select value={keywordCase} onChange={(event) => setKeywordCase(event.target.value as KeywordCase)}>
          <option value="upper">UPPER</option>
          <option value="lower">lower</option>
          <option value="preserve">As typed</option>
        </select>
      </label>
    </TransformTool>
  );
}
