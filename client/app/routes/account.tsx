import { Outlet } from '@remix-run/react';
import { Box, Typography } from '@mui/material';

export default function AccountRoute() {
  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        Account
      </Typography>
      <Outlet />
    </Box>
  );
}
