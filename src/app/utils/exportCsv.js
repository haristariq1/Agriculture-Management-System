export function exportCsv(name, rows) {
  const keys = [...new Set(rows.flatMap(Object.keys))];
  const esc = (x) => `"${String(x ?? "").replaceAll('"', '""')}"`;
  const csv = [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => esc(r[k])).join(",")),
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
