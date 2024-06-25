import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { Button } from '@/components/ui/button';
import AddAccountButton from './add-account';

interface ManageAccountsProps {
  accounts: [Account];
}

const ManageAccounts = ({ accounts }: ManageAccountsProps) => {
  return (
    <div className='my-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4'>
      <div className='flex justify-between flex-wrap gap-4 items-center'>
        <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
          <h3>My Accounts</h3>
        </div>
        <div className='flex flex-row gap-3.5 flex-wrap'>
          <AddAccountButton />
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
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account: Account) => (
            <TableRow key={account.accountId}>
              <TableCell className='font-medium'>{account.name}</TableCell>
              <TableCell>{account.category}</TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell>{account.createdAt}</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className='text-right'>Actions</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageAccounts;
