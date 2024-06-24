import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';

interface ManageAccountsProps {
  accounts: [Account];
}

const ManageAccounts = ({ accounts }: ManageAccountsProps) => {
  return (
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
  );
};

export default ManageAccounts;
