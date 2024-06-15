'use server';

export default async function AccountsPage({ params }: any) {
  const { id } = params;

  return <p>Account: {id}</p>;
}
