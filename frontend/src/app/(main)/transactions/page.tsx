'use server';

import * as actions from '@/actions';
import BankingTransactions from '@/features/banking-transactions';
import InvestmentTransactions from '@/features/investment-transactions/index';
import { BankTransaction, InvestmentTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';

const Transactions = async ({ accountId, accountCategory }: { accountId: string; accountCategory: string }) => {
  if (accountCategory === 'banking' || accountCategory === 'credit card') {
    const bankTransactions: [BankTransaction] = await actions.fetchBankTransactions(accountId);

    return <BankingTransactions accountId={accountId} transactions={bankTransactions as [BankTransaction]} />;
  } else if (accountCategory === 'investment') {
    console.log('Fetching investment transactions', accountId);
    const investmentTransactions: [InvestmentTransaction] = await actions.fetchInvestmentTransactions(accountId);

    return <InvestmentTransactions accountId={accountId} transactions={investmentTransactions} />;
  }
};

export default Transactions;
