export const money = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
export const dateText = (value) =>
  value
    ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString(
        "en-PK",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : "—";
export const dayDiff = (date, base = new Date()) =>
  Math.round(
    (Date.parse(`${date}T12:00:00Z`) -
      Date.parse(`${base.toISOString().slice(0, 10)}T12:00:00Z`)) /
      86400000,
  );
export const addDays = (date, days) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + Number(days));
  return d.toISOString().slice(0, 10);
};
