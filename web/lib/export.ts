/** Unduh konten teks sebagai file dari browser. */
export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Susun CSV dengan escaping standar; BOM disertakan agar terbaca rapi di Excel. */
export function toCsv(rows: (string | number)[][]): string {
  const escape = (cell: string | number) => {
    const s = String(cell);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + rows.map((row) => row.map(escape).join(";")).join("\r\n");
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  downloadFile(filename, toCsv(rows), "text/csv;charset=utf-8");
}

export function downloadJson(filename: string, data: unknown) {
  downloadFile(filename, JSON.stringify(data, null, 2), "application/json");
}
