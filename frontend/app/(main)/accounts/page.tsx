import { AccountsTable } from '@/components/accounts/AccountsTable';

export default function Accounts() {
  return (
    <div className='w-full py-6 px-6'>
      <h1 className='text-3xl font-bold mb-8'>Accounts</h1>
      <AccountsTable />
    </div>
  );
}
