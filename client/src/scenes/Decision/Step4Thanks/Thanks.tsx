import { makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';


const useStyles = makeStyles((theme) => ({
	divMain: {
		paddingTop: theme.spacing(2.5),
		paddingBottom: theme.spacing(5.5),
		textAlign: 'center',
	},
	gridItem: {
		maxWidth: theme.spacing(55),
		margin: theme.spacing(0, 3, 4, 3),
	},
}));



const Thanks: React.FC = () => {
	const classes = useStyles();

	return (
		<div className={classes.divMain}>
			<Grid container justify='center' alignContent='center'>
				<Grid item className={classes.gridItem} xs={12}>
					<Typography align='center' variant='h1'>Lời cám ơn</Typography>
					<Typography align='center' variant='body1'>Đơn hàng của bạn đã được tạo thành công</Typography>
				</Grid>
			</Grid>
		</div>
	);
};

export default Thanks;
