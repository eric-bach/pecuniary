'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(main)/transactions/columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Transaction } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { useNewInvestmentTransaction } from '@/hooks/use-new-investment-transaction';

interface InvestmentTransactionsListProps {
  accountId: string;
  transactions: [Transaction];
}

const InvestmentTransactionsList = ({ accountId, transactions }: InvestmentTransactionsListProps) => {
  const newInvestmentTransaction = useNewInvestmentTransaction();

  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='gap-y-2 justify-between'>
        <div className='gap-y-2 flex justify-between'>
          <p>Date Filter</p>

          <Button size='sm' onClick={() => newInvestmentTransaction.onOpen(accountId)}>
            <Plus className='size-4 mr-2' />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable filterKey='transactionDate' columns={columns} data={transactions} onDelete={(row) => console.log(row)} />
      </CardContent>
    </Card>
  );
};

export default InvestmentTransactionsList;
