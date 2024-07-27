'use server';

import DisplayAccount from '@/features/accounts/account';
import { fetchAccount } from '@/actions';
import TransactionsPage from '../../transactions/page';

interface AccountPageProps {
  params: {
    accountId: string;
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { accountId } = params;

  const account = await fetchAccount(accountId);

  return (
    <>
      {/* Call a server component from a client component using children */}
      <DisplayAccount account={account}>
        <TransactionsPage accountId={account.accountId} accountCategory={account.category.toLowerCase()} />
      </DisplayAccount>
    </>
  );
}
