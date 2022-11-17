import { createMuiTheme, Theme } from '@material-ui/core/styles';
import "@fontsource/inter";

function theme(darkMode = false): Theme {
	//Light Theme
	let background = '#cfcfe0';
	let primary = '#0f61a0';
	let primaryContrastText = '#fafafa';
	let secondary = '#6d6d6d';
	let secondaryContrastText = '#fafafa';
	let primaryText = '#3D3D3D';
	let secondaryText = '#575757';
	let disabledText = '#858585';
	let paperBackground = '#ffffff';

	if (darkMode) {
		background = '#34393f';
		primary = '#10a4f9';
		primaryContrastText = '#e3e3e3';
		secondary = '#cdcdcd';
		secondaryContrastText = '#303030';
		primaryText = '#CFCFCF';
		secondaryText = '#B0B0B0';
		disabledText = '#B0B0B0';
		paperBackground = '#595959';
	}
	/* eslint-disable no-bitwise*/
	function shadeHexColor(color: string, percent: number) {
		const f = parseInt(color.slice(1), 16);
		const t = percent < 0 ? 0 : 255;
		const p = percent < 0 ? percent * -1 : percent;
		const R = f >> 16;
		const G = (f >> 8) & 0x00ff;
		const B = f & 0x0000ff;
		return `#${(
			0x1000000 +
			(Math.round((t - R) * p) + R) * 0x10000 +
			(Math.round((t - G) * p) + G) * 0x100 +
			(Math.round((t - B) * p) + B)
		)
			.toString(16)
			.slice(1)}`;
	}

	return createMuiTheme({
		typography: {
			fontFamily: ['Inter', 'sans-serif'].join(','),
			caption: {
				fontWeight: 400,
				fontSize: 14,
			},
			fontWeightRegular: 400,
			fontWeightBold: 600,
			h1: {
				fontWeight: 600,
				fontSize: 28,
			},
			h2: {
				fontWeight: 600,
				fontSize: 23,
			},
			h3: {
				fontWeight: 600,
				fontSize: 20,
			},
			h4: {
				fontWeight: 600,
				fontSize: 18,
			},
			h5: {
				fontWeight: 600,
				fontSize: 18,
			},
			h6: {
				fontWeight: 600,
				fontSize: 16,
			},
			body1: {
				fontWeight: 500,
				fontSize: 16,
			},
			body2: {
				fontWeight: 500,
				fontSize: 16,
			},
		},
		overrides: {
			MuiAppBar: {
				root: {
					background: `linear-gradient(145deg, ${shadeHexColor(primary, -0.2)}, ${shadeHexColor(primary, -0.4)})`,
					boxShadow: `3px 3px 6px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(180, 180, 180, 0.2)`,
					shadows: ['none'],
				},
			},
			MuiSlider: {
				thumb: {
					marginTop: -7,
					height: 15,
					width: 15,
					background: `linear-gradient(145deg, ${primary}, ${shadeHexColor(primary, -0.4)})`,
					boxShadow: `3px 3px 6px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(180, 180, 180, 0.2)`,
				},
				track: {
					opacity: '100%',
					marginTop: -1,
					height: 4,
					borderRadius: 4,
					boxShadow: `inset 1px 1px 2px rgba(0, 0, 0, 0.5), inset -1px -1px 2px rgba(180, 180, 180, 0.4)`,
				},
				rail: {
					opacity: '100%',
					marginTop: -1,
					height: 4,
					borderRadius: 4,
					boxShadow: `inset 1px 1px 2px rgba(0, 0, 0, 0.5), inset -1px -1px 2px rgba(180, 180, 180, 0.4)`,
				},
			},
			MuiStepConnector: {
				line: {
					borderColor: disabledText,
				},
			},
			MuiStepIcon: {
				root: {
					boxShadow: `4px 4px 8px rgba(0, 0, 0, ${darkMode ? 0.3 : 0.4}), -4px -4px 8px rgba(255, 255, 255, ${darkMode ? 0.07 : 0.6
						})`,
					borderRadius: '50%',
					color: shadeHexColor(background, darkMode ? 0.1 : -0.5),
					'&$active': {
						color: shadeHexColor(primary, -0.2),
					},
					'&$completed': {
						color: shadeHexColor(primary, -0.2),
						borderRadius: '50%',
						background: 'white',
					},
				},
			},
			MuiIconButton: {
				root: {
					backgroundColor: shadeHexColor(background, darkMode ? 0.05 : 0.2),
					boxShadow: `3px 3px 6px rgba(0, 0, 0, 0.25), -3px -3px 6px rgba(255, 255, 255, ${darkMode ? 0.06 : 0.3})`,
					padding: 8,
					'&:hover': {
						backgroundColor: shadeHexColor(background, 0.05),
					},
					'&:active': {
						boxShadow: `inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(180, 180, 180, 0.4)`,
					},
				},
			},
			MuiTooltip: {
				tooltip: {
					boxShadow: `5px 5px 25px 2px rgba(0,0,0,0.4)`,
					backgroundColor: shadeHexColor(background, 0.3),
					color: primaryText,
				},
			},
			MuiFab: {
				root: {
					boxShadow: `6px 6px 12px rgba(0, 0, 0, ${darkMode ? 0.25 : 0.4}), -6px -6px 12px rgba(255, 255, 255, ${darkMode ? 0.1 : 0.7
						})`,
					'&:active': {
						boxShadow: `inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(180, 180, 180, 0.4)`,
					},
				},
				primary: {
					background: `linear-gradient(145deg, ${primary}, ${shadeHexColor(primary, -0.4)})`,
					'&:hover': {
						background: `linear-gradient(145deg, ${shadeHexColor(primary, -0.15)}, ${shadeHexColor(primary, -0.45)})`,
					},
					'&:active': {
						background: primary,
					},
					'&:disabled': {
						background: shadeHexColor(background, darkMode ? 0.2 : -0.2),
					},
				},
				secondary: {
					background: `linear-gradient(145deg, ${secondary}, ${shadeHexColor(secondary, -0.4)})`,
					'&:hover': {
						background: `linear-gradient(145deg, ${shadeHexColor(secondary, -0.15)}, ${shadeHexColor(secondary, -0.45)})`,
					},
					'&:active': {
						background: secondary,
					},
				},
			},
			MuiButton: {
				contained: {
					borderRadius: '20px',
					background: `linear-gradient(145deg, ${primary}, ${shadeHexColor(primary, -0.4)})`,
					boxShadow: `5px 5px 10px rgba(0, 0, 0, ${darkMode ? 0.2 : 0.4}), -5px -5px 10px rgba(255, 255, 255, ${darkMode ? 0.1 : 0.7
						})`,
					'&:hover': {
						background: `linear-gradient(145deg, ${shadeHexColor(primary, -0.15)}, ${shadeHexColor(primary, -0.45)})`,
						boxShadow: `5px 5px 10px rgba(0, 0, 0, ${darkMode ? 0.2 : 0.4}), -5px -5px 10px rgba(255, 255, 255, ${darkMode ? 0.1 : 0.7
							})`,
					},
					'&:active': {
						background: primary,
						boxShadow: `inset 5px 5px 10px rgba(0, 0, 0, 0.5), inset -5px -5px 10px rgba(180, 180, 180, 0.4)`,
					},
				},
			},
			MuiPaper: {
				rounded: {
					background: `linear-gradient(145deg, ${shadeHexColor(background, darkMode ? 0.1 : 0.1)}, ${shadeHexColor(
						background,
						darkMode ? 0 : 0.2
					)})`,
					borderRadius: '20px',
				},
				elevation1: {
					background: shadeHexColor(background, darkMode ? 0.05 : 0.2),
					boxShadow: `3px 3px 6px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, ${darkMode ? 0.05 : 0.3})`,
					borderRadius: '10px',
				},
				elevation7: {
					boxShadow: `10px 10px 35px 6px rgba(0,0,0,${darkMode ? 0.5 : 0.2})`,
				},
			},
			MuiCssBaseline: {
				'@global': {
					body: {
						background: darkMode
							? `linear-gradient(145deg, ${background}, ${shadeHexColor(background, -0.57)})`
							: `linear-gradient(145deg, ${background}, ${shadeHexColor(background, -0.1)})`,
					},
				},
			},
			MuiTypography: {
				root: {
					'& h1': {
						fontWeight: 600,
						fontSize: 28,
					},
					'& h2': {
						fontWeight: 600,
						fontSize: 23,
						marginTop: 50,
					},
					'& h3': {
						fontWeight: 600,
						fontSize: 20,
						marginBottom: -4,
						marginTop: 30,
					},
					'& h4': {
						fontWeight: 600,
						fontSize: 18,
						marginTop: 20,
					},
					'& h5': {
						fontWeight: 600,
						fontSize: 18,
					},
					'& h6': {
						fontWeight: 600,
						fontSize: 16,
					},
					'& body': {
						fontWeight: 500,
						fontSize: 16,
					},
					'& a': {
						color: primary,
					},
				},
			},
		},
		palette: {
			type: darkMode ? 'dark' : 'light',
			background: {
				default: background,
				paper: paperBackground,
			},
			primary: {
				main: primary,
				contrastText: primaryContrastText,
			},
			secondary: {
				main: secondary,
				contrastText: secondaryContrastText,
			},
			text: {
				primary: primaryText,
				secondary: secondaryText,
				disabled: disabledText,
			},
		},
	});
}

export default theme;
