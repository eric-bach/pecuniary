'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { investmentColumns } from '@/app/(main)/transactions/investment-columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Transaction } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { useNewTransaction } from '@/hooks/use-new-transaction';

interface InvestmentTransactionsProps {
  accountId: string;
  transactions: [Transaction];
}

const InvestmentTransactions = ({ accountId, transactions }: InvestmentTransactionsProps) => {
  const newTransaction = useNewTransaction();

  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='gap-y-2 justify-between'>
        <div className='gap-y-2 flex justify-between'>
          <p>Date Filter</p>

          <Button size='sm' onClick={() => newTransaction.onInvestmentOpen(accountId)}>
            <Plus className='size-4 mr-2' />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable filterKey='transactionDate' columns={investmentColumns} data={transactions} onDelete={(row) => console.log(row)} />
      </CardContent>
    </Card>
  );
};

export default InvestmentTransactions;
