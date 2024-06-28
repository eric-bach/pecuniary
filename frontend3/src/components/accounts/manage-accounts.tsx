'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { Button } from '@/components/ui/button';
import NewAccountSheet from './new-account-sheet';
import { useNewAccount } from '@/hooks/use-new-account';
import { Badge } from '../ui/badge';
import { Delete, Edit, Eye, View } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '../ui/tooltip';
import { TooltipContent, TooltipProvider } from '@radix-ui/react-tooltip';
import { useRouter } from 'next/navigation';

interface ManageAccountsProps {
  accounts: [Account];
}

const ManageAccounts = ({ accounts }: ManageAccountsProps) => {
  const router = useRouter();
  const { onOpen } = useNewAccount();

  return (
    <div className='my-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4'>
      <div className='flex justify-between flex-wrap gap-4 items-center'>
        <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
          <h3>My Accounts</h3>
        </div>
        <div className='flex flex-row gap-3.5 flex-wrap'>
          <Button color='primary' onClick={onOpen}>
            Add Account
          </Button>
          <NewAccountSheet />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account: Account) => (
            <TableRow key={account.accountId}>
              <TableCell className='font-medium'>{account.name}</TableCell>
              <TableCell>{account.category}</TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell>{account.createdAt}</TableCell>
              <TableCell>
                <Badge className='bg-green-600'>Active</Badge>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant='outline' size='icon' onClick={() => router.push(`/accounts/${account.accountId}`)} className='mr-2'>
                        <Eye size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Account</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant='outline' size='icon' onClick={() => console.log('Edit account')} className='mr-2'>
                        <Edit size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Account</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant='outline' size='icon' onClick={() => console.log('Delete account')} className='mr-2'>
                        <Delete size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Account</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageAccounts;
