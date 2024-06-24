'use server';

import DisplayAccount from '@/components/accounts';
import * as actions from '@/actions';

interface AccountsPageProps {
  params: {
    accountId: string;
  };
}

export default async function AccountsPage({ params }: AccountsPageProps) {
  const { accountId } = params;
  const account = await actions.fetchAccount(accountId);
  console.log(account);

  return <DisplayAccount account={account} />;
}
