export type CsvRow = string[];

export function parseCsv(text: string): CsvRow[] {
  const input = text.replace(/^\uFEFF/, "");
  const rows: CsvRow[] = [];

  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };

  const pushRow = () => {
    // Ignore trailing empty line
    if (row.length === 1 && row[0] === "" && rows.length > 0) {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        const next = input[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      pushField();
      continue;
    }

    if (char === "\n") {
      pushField();
      pushRow();
      continue;
    }

    if (char === "\r") {
      // Handle CRLF
      const next = input[i + 1];
      if (next === "\n") {
        i++;
      }
      pushField();
      pushRow();
      continue;
    }

    field += char;
  }

  pushField();
  // push last row if non-empty
  if (row.length > 1 || row[0] !== "" || rows.length === 0) {
    pushRow();
  }

  return rows;
}

export function csvRowsToObjects(rows: CsvRow[]): Array<Record<string, string>> {
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => normalizeHeader(h));

  const objects: Array<Record<string, string>> = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      if (!key) continue;
      obj[key] = (r[j] ?? "").trim();
    }
    // Skip fully empty rows
    if (Object.values(obj).every((v) => !v)) continue;
    objects.push(obj);
  }

  return objects;
}

function normalizeHeader(header: string): string {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\u0600-\u06FF]/g, "")
    .replace(/_+/g, "_");
}
