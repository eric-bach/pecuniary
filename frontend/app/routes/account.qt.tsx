import type { LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigation } from '@remix-run/react';
import { Box, Typography } from '@mui/material';

import { Loader } from '@aws-amplify/ui-react';

export async function loader({ request }: LoaderArgs) {
  // TODO Call Questrade
}

export default function QuestradeAccountRoute() {
  const navigation = useNavigation();
  const accounts = useLoaderData();

  if (navigation.state === 'loading') return <Loader />;

  return (
    <Box>
      <Typography>Questrade</Typography>
    </Box>
  );
}
