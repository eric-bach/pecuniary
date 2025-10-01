'use client';

import { DataTable } from '@/components/data-table';
import { investmentColumns } from '@/app/(main)/(investment-transactions)/investment-columns';
import { InvestmentTransaction } from '../../../../backend/src/appsync/api/codegen/appsync';
import { useNewTransaction } from '@/hooks/use-new-transaction';

interface InvestmentTransactionsProps {
  accountId: string;
  transactions: [InvestmentTransaction];
}

const InvestmentTransactions = ({ accountId, transactions }: InvestmentTransactionsProps) => {
  const newTransaction = useNewTransaction();

  return (
    <DataTable
      filterKey='transactionDate'
      title='Transactions'
      columns={investmentColumns}
      data={transactions}
      onClick={() => newTransaction.onInvestmentOpen(accountId)}
    />
  );
};

export default InvestmentTransactions;
