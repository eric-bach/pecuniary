import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { Theme } from '@mui/system';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    bar: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  });
});

export default () => {
  //const classes = useStyles();

  return (
    <div>
      <LinearProgress />
    </div>
  );
};
