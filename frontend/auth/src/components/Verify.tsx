import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Verify({ onVerify }: any) {
  return (
    <Container component='main' maxWidth='xs'>
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component='h2' variant='h5'>
          A confirmation email has been sent to your email. Please verify the email from the link before signing in.
        </Typography>
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 3, mb: 2 }} onClick={() => onVerify()}>
          Return to Sign In
        </Button>
      </Box>
    </Container>
  );
}
