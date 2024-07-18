'use client';

import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';
import { Button } from '@/components/ui/button';
import { useNewAccount } from '@/hooks/use-new-account';
import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(main)/accounts/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from '@/actions';

const ManageAccounts = () => {
  const newAccount = useNewAccount();

  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetchAccounts(),
  });

  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl-line-clamp-1'>Accounts</CardTitle>

          <Button size='sm' onClick={newAccount.onOpen}>
            <Plus className='size-4 mr-2' />
            Add New
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable filterKey='name' columns={columns} data={data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAccounts;
