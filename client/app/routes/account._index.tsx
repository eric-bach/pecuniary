import { LoaderArgs } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Box, Typography } from '@mui/material';
import { getClient } from '~/utils/session.server';
import { gql } from 'graphql-tag';

import { GET_ACCOUNTS } from '~/graphql/queries';
import { Account, GetAccountsResponse } from '~/types/types';

export async function loader({ request }: LoaderArgs) {
  const client = await getClient(request);

  const { data } = await client.query<GetAccountsResponse>({
    query: gql(GET_ACCOUNTS),
  });

  return data.getAccounts;
}

export default function AccountRoute() {
  const accounts = useLoaderData();

  return (
    <Box>
      <Link to='new'>Add your own</Link>

      {accounts.map((x: Account) => (
        <div key={x.pk}>{x.pk}</div>
      ))}
    </Box>
  );
}
