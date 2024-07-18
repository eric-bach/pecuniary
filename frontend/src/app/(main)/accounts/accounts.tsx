// app/accounts/accounts.jsx
'use client';

import { fetchAccounts } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export default function Posts() {
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetchAccounts(),
  });

  console.log('DATA', data);

  return (
    <div>
      <h1>Accounts</h1>
      <ul>
        {data?.map((account) => (
          <li key={account.accountId}>{account.name}</li>
        ))}
      </ul>
    </div>
  );
}
