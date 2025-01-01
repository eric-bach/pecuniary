import { calculateAdjustedCostBase } from '../../../src/lambda/updatePosition/main';
import { InvestmentTransaction } from '../../../src/appsync/api/codegen/appsync';

describe('calculateAdjustedCostBase', () => {
  it('should handle empty transactions array', () => {
    const transactions: InvestmentTransaction[] = [];

    const { shares, acb, bookValue } = calculateAdjustedCostBase(transactions);

    expect(shares).toBe(0);
    expect(bookValue).toBe(0);
    expect(acb).toBe(0);
  });

  it('should calculate ACB, shares, and book value correctly for a one transaction', () => {
    const transactions: InvestmentTransaction[] = [
      {
        pk: '1',
        type: 'buy',
        shares: 10,
        price: 100,
        commission: 10,
        accountId: '1',
        userId: '1',
        symbol: 'AAPL',
        transactionDate: '2023-01-01',
        transactionId: '1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        entity: 'investment-transaction',
      },
    ];

    const { shares, acb, bookValue } = calculateAdjustedCostBase(transactions);

    expect(shares).toBe(10);
    expect(bookValue).toBeCloseTo(990, 2); // Book value after transactions
    expect(acb).toBeCloseTo(1010, 2); // Adjusted cost base after transactions
  });

  it('should calculate ACB, shares, and book value correctly for a series of transactions', () => {
    const transactions: InvestmentTransaction[] = [
      {
        pk: '1',
        type: 'buy',
        shares: 10,
        price: 100,
        commission: 10,
        accountId: '1',
        userId: '1',
        symbol: 'AAPL',
        transactionDate: '2023-01-01',
        transactionId: '1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        entity: 'investment-transaction',
      },
      {
        pk: '2',
        type: 'buy',
        shares: 5,
        price: 110,
        commission: 5,
        accountId: '1',
        userId: '1',
        symbol: 'AAPL',
        transactionDate: '2023-01-02',
        transactionId: '2',
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        entity: 'investment-transaction',
      },
      {
        pk: '3',
        type: 'sell',
        shares: 7,
        price: 120,
        commission: 8,
        accountId: '1',
        userId: '1',
        symbol: 'AAPL',
        transactionDate: '2023-01-03',
        transactionId: '3',
        createdAt: '2023-01-03T00:00:00Z',
        updatedAt: '2023-01-03T00:00:00Z',
        entity: 'investment-transaction',
      },
      {
        pk: '4',
        type: 'buy',
        shares: 4,
        price: 118,
        commission: 5,
        accountId: '1',
        userId: '1',
        symbol: 'AAPL',
        transactionDate: '2023-01-04',
        transactionId: '4',
        createdAt: '2023-01-04T00:00:00Z',
        updatedAt: '2023-01-04T00:00:00Z',
        entity: 'investment-transaction',
      },
      {
        pk: '5',
        type: 'sell',
        shares: 4,
        price: 123,
        commission: 5,
        accountId: '1',
        userId: '1',
        symbol: 'AAPL',
        transactionDate: '2023-01-05',
        transactionId: '5',
        createdAt: '2023-01-05T00:00:00Z',
        updatedAt: '2023-01-05T00:00:00Z',
        entity: 'investment-transaction',
      },
    ];

    const { shares, acb, bookValue } = calculateAdjustedCostBase(transactions);

    expect(shares).toBe(8);
    expect(bookValue).toBeCloseTo(683, 2); // Book value after transactions
    expect(acb).toBeCloseTo(874.44, 2); // Adjusted cost base after transactions
  });
});
