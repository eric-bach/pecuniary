'use server';

import * as actions from '@/actions';
import BankingTransactions from '@/features/banking-transactions';
import InvestmentTransactions from '@/features/investment-transactions/index';

const Transactions = async ({ accountId, accountCategory }: { accountId: string; accountCategory: string }) => {
  const transactions = await actions.fetchTransactions(accountId);

  if (accountCategory === 'investment') {
    return <InvestmentTransactions accountId={accountId} transactions={transactions} />;
  } else if (accountCategory === 'banking' || accountCategory === 'credit card') {
    return <BankingTransactions accountId={accountId} transactions={transactions} />;
  }
};

export default Transactions;
