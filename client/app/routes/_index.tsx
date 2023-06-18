import { Box, Skeleton, Typography } from '@mui/material';

export default function IndexRoute() {
  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        Welcome to Pecuniary
      </Typography>
      <Skeleton />
      <Skeleton animation='wave' />
      <Skeleton animation={false} />
    </Box>
  );
}
