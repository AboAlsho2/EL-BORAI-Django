const numberFormat = new Intl.NumberFormat("ar-EG", {
  maximumFractionDigits: 2,
});

export function formatNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? numberFormat.format(n) : String(value ?? "");
}

export function formatMoney(value) {
  return `${formatNumber(value)} ج`;
}

export function stockState(stock) {
  if (stock <= 0) return "out";
  if (stock <= 5) return "low";
  return "ok";
}
