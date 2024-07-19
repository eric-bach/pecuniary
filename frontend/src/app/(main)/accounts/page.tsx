import ManageAccounts from '@/features/accounts/manage-accounts';
import { fetchAccounts } from '@/actions';

export default async function Accounts() {
  const accounts = await fetchAccounts();

  return <ManageAccounts accounts={accounts} />;
}
