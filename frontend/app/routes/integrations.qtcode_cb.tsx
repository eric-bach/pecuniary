import { Container } from '@mui/material';
import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import config from '../aws-exports';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code') || '';
  console.log('Code', code);

  //return code;
  const response = await fetch(`https://login.questrade.com/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.qt_client_id,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: encodeURIComponent(`${config.qt_redirect_url}/qtcode_cb2`),
    }),
  });

  console.log('response', response);

  const data = await response.json();
  console.log(data);

  return response.statusText;
}

export default function () {
  const data = useLoaderData();

  return <Container>Added Questrade Integration. ${data} You can close this page.</Container>;
}
