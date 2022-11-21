import { makeStyles, Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { ContactFormFields } from './components/ContactFormFields';
import { ShoppingCart } from './components/ShoppingCart';

// const onChangeNewEntry$ = new Subject();

const useStyles = makeStyles((theme) => ({
	divMain: {
		paddingTop: theme.spacing(2.5),
		paddingBottom: theme.spacing(5.5),
		textAlign: 'center',
	},
	gridItem: {
		margin: theme.spacing(0, 3, 4, 3),
	},
}));



const ContactForm: React.FC = () => {

	
	const classes = useStyles();

	return (
		<div className={classes.divMain}>
			<Grid container justify='center' alignContent='center'>
				<Grid item className={classes.gridItem} xs={6}>
					<Paper elevation={2}>
						<ContactFormFields />
					</Paper>
				</Grid>
				<Grid item className={classes.gridItem} xs={3}>
					<Paper elevation={2}>
						<ShoppingCart />
					</Paper>
				</Grid>
			</Grid>
		</div>
	);
};

export default ContactForm;
