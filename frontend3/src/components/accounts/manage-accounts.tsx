'use client';

import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { Button } from '@/components/ui/button';
import { useNewAccount } from '@/hooks/use-new-account';
import { DataTable } from '@/components/accounts/data-table';
import { columns } from '@/components/accounts/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface ManageAccountsProps {
  accounts: [Account];
}

const ManageAccounts = ({ accounts }: ManageAccountsProps) => {
  const newAccount = useNewAccount();

  return (
    <div className='mx-auto -mt-6 w-full max-w-screen-2xl pb-10'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl-line-clamp-1'>Accounts</CardTitle>

          <Button size='sm' onClick={newAccount.onOpen}>
            <Plus className='size-4 mr-2' /> Add New
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable filterKey='name' columns={columns} data={accounts} onDelete={(row) => console.log(row)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAccounts;