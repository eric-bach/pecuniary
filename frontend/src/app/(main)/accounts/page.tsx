import Accounts from '@/features/accounts';
import { fetchAccounts } from '@/actions';

export default async function AccountsPage() {
  const accounts = await fetchAccounts();

  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <Accounts accounts={accounts} />
    </div>
  );
}
