'use client';

import { DataTable } from '@/components/data-table';
import { bankingColumns } from '@/app/(main)/transactions/banking-columns';
import { BankTransaction } from '../../../../backend/src/appsync/api/codegen/appsync';
import { useNewTransaction } from '@/hooks/use-new-transaction';

interface BankingTransactionsProps {
  accountId: string;
  transactions: [BankTransaction];
}

const BankingTransactions = ({ accountId, transactions }: BankingTransactionsProps) => {
  const newTransaction = useNewTransaction();

  return (
    <DataTable
      filterKey='transactionDate'
      title='Transactions'
      columns={bankingColumns}
      data={transactions}
      onClick={() => newTransaction.onBankingOpen(accountId)}
    />
  );
};

export default BankingTransactions;
