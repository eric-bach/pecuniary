'use server';

import DisplayAccount from '@/features/accounts/account';

interface AccountPageProps {
  params: {
    accountId: string;
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { accountId } = params;

  {
    /* Call a server component from a client component using children */
  }
  return <DisplayAccount />;
}
