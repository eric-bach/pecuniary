'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { bankingColumns } from '@/app/(main)/transactions/banking-columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BankTransaction } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { useNewTransaction } from '@/hooks/use-new-transaction';

interface BankingTransactionsProps {
  accountId: string;
  transactions: [BankTransaction];
}

const BankingTransactions = ({ accountId, transactions }: BankingTransactionsProps) => {
  const newTransaction = useNewTransaction();

  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='gap-y-2 justify-between'>
        <div className='gap-y-2 flex justify-between'>
          <p>Date Filter</p>

          <Button size='sm' onClick={() => newTransaction.onBankingOpen(accountId)}>
            <Plus className='size-4 mr-2' />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable filterKey='transactionDate' columns={bankingColumns} data={transactions} onDelete={(row) => console.log(row)} />
      </CardContent>
    </Card>
  );
};

export default BankingTransactions;
