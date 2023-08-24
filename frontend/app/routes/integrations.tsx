import { LoaderArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { Box, Typography } from '@mui/material';
import { requireUserId } from '~/utils/session.server';

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request, '/login');

  return null;
}

export default function IntegrationsRoute() {
  return (
    <Box>
      <Typography variant='h4'>Integrations</Typography>
      <Outlet />
    </Box>
  );
}
