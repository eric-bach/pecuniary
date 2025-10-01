import { AccountsTable } from '@/components/accounts/AccountsTable';

export default function Accounts() {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-8'>Accounts</h1>
      <AccountsTable />
    </div>
  );
}
