import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  root: {
    height: '100vh',
  },
  hover: {
    '&:hover': { cursor: 'pointer' },
  },
});

export default function Verify() {
  const classes = useStyles();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const history = useHistory();

  const sendClicked = async () => {
    try {
      console.log('VERIFY CLICKED');
    } catch (err) {
      setError('Invalid Code');
    }
  };

  const passwordResetClicked = async () => {
    history.push('/resetpassword');
  };

  return (
    <Grid className={classes.root} container direction='row' justifyContent='center' alignItems='center'>
      <Grid xs={11} sm={6} lg={4} container direction='row' justifyContent='center' alignItems='center' item>
        <Paper style={{ width: '100%', padding: 32 }}>
          <Grid container direction='column' justifyContent='center' alignItems='center'>
            {/* Title */}
            <Box m={2}>
              <Typography variant='h3'>Verify Code</Typography>
            </Box>

            {/* Sign In Form */}
            <Box width='80%' m={1}>
              <TextField
                fullWidth
                variant='outlined'
                label='Code'
                onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setCode(evt.target.value);
                }}
              />
              <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
                <Box onClick={passwordResetClicked} mt={2}>
                  <Typography className={classes.hover} variant='body2'>
                    Resend Code
                  </Typography>
                  <Box mt={2}>
                    <Typography color='error' variant='body2'>
                      {error}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Box>

            {/* Buttons */}
            <Box mt={2}>
              <Grid container direction='row' justifyContent='center'>
                <Box m={1}>
                  <Button color='secondary' variant='contained' onClick={() => history.goBack()}>
                    Cancel
                  </Button>
                </Box>
                <Box m={1}>
                  <Button color='primary' variant='contained' onClick={sendClicked}>
                    Send
                  </Button>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
