export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function parsePriceToCents(price: string) {
  return Math.round(parseFloat(price) * 100);
}
