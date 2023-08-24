import { Container } from '@mui/material';
import { ActionArgs, ActionFunction, redirect } from '@remix-run/node';
import { useLocation } from '@remix-run/react';

import config from '../aws-exports';

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  return redirect('/account');
};

function parseHash(hash: string) {
  // Remove leading '#' and split the hash into parameter-value pairs
  const paramsArray = hash.slice(1).split('&');

  // Initialize an object to store the parsed parameters and values
  const parsedParams: any = {};

  // Loop through the array to parse each parameter and value
  for (const param of paramsArray) {
    const [key, value] = param.split('=');
    parsedParams[key] = value;
  }

  return parsedParams;
}

export default function () {
  const location = useLocation();
  const hash = parseHash(location.hash);

  console.log('Location', location);
  console.log('Hash', hash);

  // TODO Save QT Creds

  return <Container>Added Questrade Integration. You can close this page.</Container>;
}
