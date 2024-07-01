'use server';

import DisplayAccount from '@/features/accounts';
import * as actions from '@/actions';

interface AccountsPageProps {
  params: {
    accountId: string;
  };
}

export default async function AccountsPage({ params }: AccountsPageProps) {
  const { accountId } = params;

  const account = await actions.fetchAccount(accountId);

  return <DisplayAccount account={account} />;
}
