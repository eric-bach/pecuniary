import { LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigation } from '@remix-run/react';
import { Box } from '@mui/material';
import { getClient } from '~/utils/session.server';
import { gql } from 'graphql-tag';

import { GET_ACCOUNTS } from '~/graphql/queries';
import { Account, GetAccountsResponse } from '~/types/types';
import { Loader } from '@aws-amplify/ui-react';

export async function loader({ request }: LoaderArgs) {
  const client = await getClient(request);

  const { data } = await client.query<GetAccountsResponse>({
    query: gql(GET_ACCOUNTS),
  });

  return data.getAccounts;
}

export default function AccountRoute() {
  const navigation = useNavigation();
  const accounts = useLoaderData();

  if (navigation.state === 'loading') return <Loader />;

  return (
    <Box>
      <Link to='new'>Add your own</Link>

      {accounts.map((x: Account) => (
        <div key={x.pk}>{x.pk}</div>
      ))}
    </Box>
  );
}
