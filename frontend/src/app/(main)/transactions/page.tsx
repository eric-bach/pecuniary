'use server';

import * as actions from '@/actions';
import InvestmentTransactionsList from '@/features/transactions/investment-transactions';

const Transactions = async ({ accountId, accountCategory }: { accountId: string; accountCategory: string }) => {
  const transactions = await actions.fetchTransactions(accountId);

  if (accountCategory === 'investment') {
    return <InvestmentTransactionsList accountId={accountId} transactions={transactions} />;
  }

  // TODO Support banking transactions
  return <div>TBD Banking Transactions</div>;
};

export default Transactions;
