import { json, type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigation } from '@remix-run/react';
import { Box } from '@mui/material';
import { getClient } from '~/utils/session.server';
import { gql } from 'graphql-tag';

import { GET_ACCOUNTS } from '~/graphql/queries';
import type { Account, GetAccountsResponse } from '~/types/types';
import { Loader } from '@aws-amplify/ui-react';

export async function loader({ request }: LoaderArgs) {
  const client = await getClient(request);

  console.log('Client', client);

  const { data } = await client.query<GetAccountsResponse>({
    query: gql(GET_ACCOUNTS),
  });

  // const wResp = await fetch('https://goweather.herokuapp.com/weather/Vancouver');
  // const weather = await wResp.json();
  // console.log(weather);

  // const res = await fetch(`https://api03.iq.questrade.com/v1/accounts`, {
  //   method: 'GET',
  //   headers: {
  //     Authorization: 'Bearer OErDxOIeA_10MqgsBef8DvTAl4XzLihD0',
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const qtData = await res.json();

  console.debug('Accounts: ', data);
  // console.debug('QT Accounts: ', qtData);

  let accounts: any[] = [];
  data.getAccounts.map((d) => {
    accounts.push({
      id: d.pk,
      name: d.name,
      type: d.type,
    });
  });
  // qtData.accounts.map((x: any) => {
  //   accounts.push({
  //     id: x.number,
  //     name: x.type,
  //     type: x.type,
  //   });
  // });

  return accounts;
}

export default function AccountRoute() {
  const navigation = useNavigation();
  const accounts = useLoaderData();

  if (navigation.state === 'loading') return <Loader />;

  return (
    <Box>
      <Link to='new'>Add your own</Link>
      <br />

      {accounts.map((x: any) => (
        <div key={x.id}>
          {x.id} {x.name} {x.type}
        </div>
      ))}
    </Box>
  );
}
