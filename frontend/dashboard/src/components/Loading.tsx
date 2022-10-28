import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Loading = () => {
  return (
    <Container>
      <Grid container spacing={0} justifyContent='center' alignContent='center'>
        <Grid
          item
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& > * + *': {
              marginLeft: 2,
            },
          }}
        >
          <CircularProgress />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Loading;
