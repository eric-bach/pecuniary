import {Dialog} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {isEdge, isMobile} from 'react-device-detect';
import ReactGA from 'react-ga';

import {PrivacyText} from '../constants/PrivacyTexts';

const useStyles = makeStyles(theme => ({
	div: {
		position: 'fixed',
		margin: theme.spacing(0, 10, 5, 10),
		zIndex: 2000,
	},

	grid: {
		outline: 'none',
	},

	paper: {
		maxWidth: '85%',
	},

	typographyGridItem: {
		margin: theme.spacing(0, 3, 0, 3),
	},

	button: {
		margin: theme.spacing(0, 3, 2, 0),
	},
}));

const CookiesBanner: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('cookieConsentAccepted') == null) {setIsVisible(true);}
	}, []);

	const classes = useStyles();

	const handleClose = () => {
		ReactGA.event({
			category: 'Cookies dialog',
			action: `Close cookie dialog`,
		});

		setIsVisible(false);

		localStorage.setItem('cookieConsentAccepted', 'true');
	};

	const desktopBanner = (
		<div role='dialog' className={classes.div} style={{bottom: isEdge ? 10 : 'env(safe-area-inset-bottom)'}}>
			<Slide direction='up' in={isVisible} mountOnEnter unmountOnExit>
				<Grid data-testid='cookiesConsent' className={classes.grid} container justify='center' alignContent='center'>
					<Paper className={classes.paper} elevation={7}>
						<Grid item className={classes.typographyGridItem} xs={12}>
							<Typography component='span' data-testid='cookiesBanner' align='justify'>
								{PrivacyText}
							</Typography>
						</Grid>
						<Grid container justify='flex-end'>
							<Button
								data-testid='cookieConsentCloseButton'
								onClick={() => handleClose()}
								className={classes.button}
								variant='contained'
								color='primary'
							>
								Understood
							</Button>
						</Grid>
					</Paper>
				</Grid>
			</Slide>
		</div>
	);

	const mobileDialog = (
		<Dialog data-testid='cookiesConsent' open={isVisible} onClose={handleClose}>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>{PrivacyText}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					data-testid='cookieConsentCloseButton'
					className={classes.button}
					onClick={handleClose}
					variant='contained'
					color='primary'
				>
					Understood
				</Button>
			</DialogActions>
		</Dialog>
	);

	if (isMobile) {
		return mobileDialog;
	}
	return desktopBanner;
};

export default CookiesBanner;
