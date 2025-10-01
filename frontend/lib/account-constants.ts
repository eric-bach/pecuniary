// Account configuration constants
export const categories = ['Banking', 'Credit Card', 'Investment', 'Asset'] as const;
export const investmentTypes = ['Non Registered', 'TFSA', 'RRSP', 'LIRA', 'Crypto'] as const;
export const bankingTypes = ['Chequing', 'Savings'] as const;
export const creditCardTypes = ['Credit'] as const;
export const assetTypes = ['Property'] as const;

export type Category = (typeof categories)[number];
export type InvestmentType = (typeof investmentTypes)[number];
export type BankingType = (typeof bankingTypes)[number];
export type CreditCardType = (typeof creditCardTypes)[number];
export type AssetType = (typeof assetTypes)[number];

// Helper function to get valid types for a category
export function getTypesForCategory(category: Category): readonly string[] {
  switch (category) {
    case 'Banking':
      return bankingTypes;
    case 'Credit Card':
      return creditCardTypes;
    case 'Investment':
      return investmentTypes;
    case 'Asset':
      return assetTypes;
    default:
      return [];
  }
}
