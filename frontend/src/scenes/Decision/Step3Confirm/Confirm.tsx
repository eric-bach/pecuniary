import { makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'services/redux/rootReducer';
import { ShoppingCart } from '../Step2ContactForm/components/ShoppingCart';

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

const Confirm: React.FC = () => {

	const classes = useStyles();
	const { status } = useSelector((state: RootState) => state.Order, shallowEqual);


	return (
		<div className={classes.divMain}>
			<Grid container justify='center' alignContent='center'>
				<Grid item className={classes.gridItem} xs={12}>
					<Typography align='center' variant='h1'>Bạn chắc chắn muốn đặt đơn hàng này chứ?</Typography>
					<ShoppingCart />
					{status === 'loading' ? 'Loading' : ''}
				</Grid>
			</Grid>
		</div>
	);
};

export default Confirm;
