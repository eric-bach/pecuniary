import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        '& > * + *': {
          marginLeft: 2,
        },
      }}
    >
      <CircularProgress />
      <CircularProgress color='secondary' />
    </Box>
  );
};

export default Loading;
