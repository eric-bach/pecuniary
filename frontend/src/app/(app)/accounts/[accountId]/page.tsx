'use server';

interface AccountsPageProps {
  params: {
    accountId: string;
  };
}

export default async function AccountsPage({ params }: AccountsPageProps) {
  const { accountId } = params;

  return <p>Account: {accountId}</p>;
}
