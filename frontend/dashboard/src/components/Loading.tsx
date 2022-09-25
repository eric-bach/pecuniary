import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  })
);

const Loading = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
      <CircularProgress color='secondary' />
    </div>
  );
};

export default Loading;
