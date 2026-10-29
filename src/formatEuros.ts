// Whole euros in the app locale: "€375" in English, "375 €" in Portuguese.
export function formatEuros(amount: number, locale = 'en-IE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
