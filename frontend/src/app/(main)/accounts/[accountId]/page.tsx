'use server';

import DisplayAccount from '@/features/accounts';
import * as actions from '@/actions';
import Transactions from '../../transactions/page';

interface AccountsPageProps {
  params: {
    accountId: string;
  };
}

export default async function AccountsPage({ params }: AccountsPageProps) {
  const { accountId } = params;

  const account = await actions.fetchAccount(accountId);

  return (
    <>
      {/* Call a server component from a client component using children */}
      <DisplayAccount account={account}>
        <Transactions accountId={account.accountId} accountCategory={account.category.toLowerCase()} />
      </DisplayAccount>
    </>
  );
}
