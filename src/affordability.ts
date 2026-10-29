// How much of the customer's usual monthly surplus a saving amount takes.
// Single source of truth for the thresholds shown on the Plan option badge.
export type Affordability = 'comfortable' | 'balanced' | 'tight' | 'over';

export function getAffordability(monthlyAmount: number, monthlySurplus: number): Affordability {
  if (monthlySurplus <= 0) return 'over';
  const share = monthlyAmount / monthlySurplus;
  if (share <= 0.65) return 'comfortable';
  if (share <= 0.8) return 'balanced';
  if (share <= 1) return 'tight';
  return 'over';
}
