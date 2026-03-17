export function formatMoney(amount: number, currency: string, locale?: string): string {
  const safeCurrency = (currency || "CAD").toUpperCase();
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  const resolvedLocale =
    locale ||
    (safeCurrency === "NGN" ? "en-NG" : safeCurrency === "EUR" ? "en-IE" : "en-CA");

  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: "currency",
      currency: safeCurrency,
      currencyDisplay: "symbol",
      maximumFractionDigits: 0,
    }).format(safeAmount);
  } catch {
    // Fallback for unknown currency codes / older runtimes
    const symbol =
      safeCurrency === "NGN" ? "₦" : safeCurrency === "EUR" ? "€" : safeCurrency === "USD" ? "$" : "$";
    return `${safeCurrency} ${symbol}${safeAmount.toLocaleString()}`;
  }
}

