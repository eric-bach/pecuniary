import { IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { Brightness3, FlareRounded } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactGA, { ga } from 'react-ga';
import './index.css';

import AlertsBanner from './components/AlertsBanner';
import ComponentsTooltip from './components/ComponentsTooltip';
import theme from './muiTheme';
import Decision from './scenes/Decision/Decision';

const useStyles = makeStyles(styleTheme => ({
	divMain: {
		flexGrow: 1,
		width: '100%',
		overflowX: 'hidden', //Avoid negative margin from mainGrid
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},

	appBar: {
		Top: 'env(safe-area-inset-top)',
		background: 'transparent',
		boxShadow: 'none',
		paddingTop: styleTheme.spacing(1),
		justifyContent: 'center',
		justifyItems: 'center',
		paddingLeft: 'env(safe-area-inset-left)',
		paddingRight: 'env(safe-area-inset-right)',
	},

	logo: {
		maxWidth: styleTheme.spacing(17),
		height: '60%',
	},

	footer: {
		marginTop: 'auto',
		marginBottom: styleTheme.spacing(0.5),
		paddingBottom: 'env(safe-area-inset-bottom)',
		zIndex: 900,
	},
	linkButton: {
		textTransform: 'none',
		textDecoration: 'underline',
		marginTop: styleTheme.spacing(-0.5),
		fontWeight: 'normal',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
}));

const App: React.FC = () => {
	const classes = useStyles();

	const [isDarkModeActive, setIsDarkModeActive] = useState(false);

	useEffect(() => {
		defineDarkMode();

		logAppVersion();

		initializeGoogleAnalytics();
	}, []);

	useEffect(() => {
		if (isDarkModeActive) {localStorage.setItem('isDarkModeActive', 'true');}
		else {localStorage.setItem('isDarkModeActive', 'false');}
	}, [isDarkModeActive]);

	const defineDarkMode = () => {
		if (localStorage.getItem('isDarkModeActive') == null) {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				setIsDarkModeActive(true);
				localStorage.setItem('isDarkModeActive', 'true');
			} else {
				setIsDarkModeActive(false);
				localStorage.setItem('isDarkModeActive', 'false');
			}
		} else if (localStorage.getItem('isDarkModeActive') === 'true') {setIsDarkModeActive(true);}
	};

	const initializeGoogleAnalytics = () => {
		if (process.env.REACT_APP_googleAnalyticsKey != null) {ReactGA.initialize(process.env.REACT_APP_googleAnalyticsKey);}

		if (window.matchMedia('(display-mode: standalone)').matches) {
			ReactGA.event({
				category: 'App Mode',
				action: 'Progressive Web App',
			});
		} else {
			ReactGA.event({
				category: 'App Mode',
				action: 'Web App',
			});
		}
	};

	const logAppVersion = () => {
		ReactGA.pageview(window.location.pathname + window.location.search);
		ga('set', 'appVersion', process.env.REACT_APP_VERSION);

		// eslint-disable-next-line no-console
		console.info(`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`);
	};

	const handleClickOnDarkMode = () => {
		ReactGA.event({
			category: 'Change dark mode',
			action: (!isDarkModeActive).toString(),
		});

		setIsDarkModeActive(darkMode => !darkMode);
	};

	const appTheme = React.useMemo(() => theme(isDarkModeActive), [isDarkModeActive]);

	return (
		<ThemeProvider theme={appTheme}>
			<CssBaseline />
			<main role='main'>
				<div className={classes.divMain}>
					<AppBar
						position='static'
						color='primary'
						className={classes.appBar}
						style={{marginBottom: isMobile ? 0 : appTheme.spacing(-2)}}
					>
						<Toolbar>
							<div style={{flexGrow: 1}} />
							<ComponentsTooltip>
								<IconButton
									aria-label={isDarkModeActive ? 'Set light theme' : 'Set dark theme'}
									onClick={handleClickOnDarkMode}
									data-testid='darkModeButton'
								>
									{isDarkModeActive ? <FlareRounded /> : <Brightness3 />}
								</IconButton>
							</ComponentsTooltip>
						</Toolbar>
					</AppBar>
					<Decision />
					<AlertsBanner />
				</div>
			</main>
		</ThemeProvider>
	);
};

export default App;
