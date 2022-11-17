import {Box, Input} from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddRounded';
import DeleteIcon from '@material-ui/icons/DeleteOutlineRounded';
import React, {useRef, useState} from 'react';
import ReactGA from 'react-ga';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import ComponentsTooltip from '../../../../components/ComponentsTooltip';
import InstructionsBox from '../../../../components/InstructionsBox';
import {AlertType} from '../../../../constants/Alerts';
import AppSlice from '../../../../services/redux/actionsAndSlicers/AppSlice';
import OptionsAndCriteriaSlice, {
	OptionAndCriteria,
	OptionsAndCriteriaKeys,
} from '../../../../services/redux/actionsAndSlicers/OptionsAndCriteriaSlice';
import RatedOptionsSlice from '../../../../services/redux/actionsAndSlicers/RatedOptionsSlice';
import WeightedCriteriaSlice from '../../../../services/redux/actionsAndSlicers/WeightCriteriaSlice';
import {RootState} from '../../../../services/redux/rootReducer';
import {useEffectUnsafe} from '../../../../services/unsafeHooks';

const onChangeNewEntry$ = new Subject();

const useStyles = makeStyles(theme => ({
	divMain: {
		minWidth: theme.spacing(37),
		marginBottom: theme.spacing(6),
	},

	paperTitle: {
		margin: theme.spacing(2, 1, 2, 1),
	},

	paperItems: {
		margin: theme.spacing(1, 1, 0, 1),
	},

	entryButtons: {
		marginRight: theme.spacing(1),
		marginLeft: theme.spacing(3),
	},

	inputBase: {
		margin: theme.spacing(1, 2, 1.5, 2.5),
		width: '100%',
		wordWrap: 'break-word',
	},
}));

type Props = {
	itemsKey: OptionsAndCriteriaKeys;
	notEnoughItemsAlert: AlertType;
};

const EditableList: React.FC<Props> = (props: Props) => {
	const {notEnoughItemsAlert, itemsKey} = props;

	const [didMount, setDidMount] = useState(false);
	const [newEntry, setNewEntry] = useState('');
	const [localItems, setLocalItems] = useState<OptionAndCriteria[]>([]);
	const [stopAnimation, setStopAnimation] = useState(false);
	const [itemsType, setItemsType] = useState('');
	const items = useSelector((state: RootState) => state.OptionsAndCriteria[itemsKey], shallowEqual);
	const [areInstructionsVisible, setAreInstructionsVisible] = useState(false);
	const newEntryRef = useRef('');

	const {instructionsStepNum} = useSelector((state: RootState) => state.App, shallowEqual);

	const paperRef = useRef(null);

	const startAnimationDelay = 400;
	const animationDelayPerItem = 200;

	const isDecisionOptionsList = itemsKey === OptionsAndCriteriaKeys.decisionOptions;

	const classes = useStyles();
	const dispatch = useDispatch();
	const theme = useTheme();

	useEffectUnsafe(() => {
		if (isDecisionOptionsList) {setItemsType('Decision options');}
		else {setItemsType('Selection criteria');}

		const subscription = onChangeNewEntry$.pipe(debounceTime(1000)).subscribe(() => {
			dispatch(AppSlice.actions.goToInstructionsStep(1));
		});

		setLocalItems(items);
		setDidMount(true);

		return () => {
			subscription.unsubscribe();
			dispatch(AppSlice.actions.deleteAlert(notEnoughItemsAlert));
			onCreateItem(newEntryRef.current);
		};
	}, []);

	useEffectUnsafe(() => {
		if (items.length !== localItems.length && didMount) {
			clearNewEntryWhenCreated();
		}

		if (didMount) {
			setLocalItems(items);
		}
		manageNotEnoughItemsAlerts();

		manageInstructionsStepNum();
	}, [items]);

	useEffectUnsafe(() => {
		if (
			(isDecisionOptionsList && instructionsStepNum >= 0 && instructionsStepNum < 3) ||
			(!isDecisionOptionsList && instructionsStepNum >= 3 && instructionsStepNum < 5)
		)
			{setAreInstructionsVisible(true);}
		else {setAreInstructionsVisible(false);}

		manageInstructionsStepNum();
	}, [instructionsStepNum]);

	const onCreateItem = (_newEntry: string) => {
		if (_newEntry === '') {return;}

		const newItem: OptionAndCriteria = {
			id: Math.max(...items.map(object => object.id), 0) + 1,
			name: _newEntry,
			score: 0,
		};

		ReactGA.event({
			category: itemsType,
			action: `Create ${itemsType}`,
		});

		if (isDecisionOptionsList) {
			dispatch(OptionsAndCriteriaSlice.actions.addDecisionOption(newItem));
		} else {
			dispatch(OptionsAndCriteriaSlice.actions.addSelectionCriteria(newItem));
		}
	};

	const onChangeNewEntry = (event: React.BaseSyntheticEvent) => {
		setNewEntry(event.target.value);

		if (isDecisionOptionsList && instructionsStepNum === 0) {onChangeNewEntry$.next(event.target.value);}
	};

	const onChangeItem = (event: React.BaseSyntheticEvent, itemId: number) => {
		setLocalItems(localItems.map(item => (item.id === itemId ? {...item, name: event.target.value} : item)));
	};

	const onLeaveItem = (itemLocal: OptionAndCriteria) => {
		if (itemLocal.name !== '') {
			ReactGA.event({
				category: itemsType,
				action: `Edit ${itemsType}`,
			});

			if (isDecisionOptionsList) {dispatch(OptionsAndCriteriaSlice.actions.updateDecisionOption(itemLocal));}
			else {dispatch(OptionsAndCriteriaSlice.actions.updateSelectionCriteria(itemLocal));}
		} else {
			ReactGA.event({
				category: itemsType,
				action: `Delete ${itemsType} after empty`,
			});
			if (isDecisionOptionsList) {dispatch(OptionsAndCriteriaSlice.actions.deleteDecisionOption(itemLocal.id));}
			else {dispatch(OptionsAndCriteriaSlice.actions.deleteSelectionCriteria(itemLocal.id));}
		}
	};

	const onDeleteItem = (itemLocal: OptionAndCriteria) => {
		ReactGA.event({
			category: itemsType,
			action: `Delete ${itemsType}`,
		});

		if (isDecisionOptionsList) {
			dispatch(OptionsAndCriteriaSlice.actions.deleteDecisionOption(itemLocal.id));
			dispatch(RatedOptionsSlice.actions.deleteRatedOptionsOfDecisionOption(itemLocal));
		} else {
			dispatch(OptionsAndCriteriaSlice.actions.deleteSelectionCriteria(itemLocal.id));
			dispatch(RatedOptionsSlice.actions.deleteRatedOptionsOfSelectionCriteria(itemLocal));
			dispatch(WeightedCriteriaSlice.actions.deleteWeightedCriteriaOfSelectionCriteria(itemLocal));
		}
	};

	useEffectUnsafe(() => {
		if (newEntry === '' && instructionsStepNum === 1) {
			dispatch(AppSlice.actions.goToInstructionsStep(0));
		}

		newEntryRef.current = newEntry;
	}, [newEntry]);

	const manageInstructionsStepNum = () => {
		if (isDecisionOptionsList && items.length >= 1 && instructionsStepNum === 1) {
			dispatch(AppSlice.actions.goToInstructionsStep(2));
		}
		if (isDecisionOptionsList && items.length >= 2 && instructionsStepNum === 2) {
			dispatch(AppSlice.actions.goToInstructionsStep(3));
		}
		if (!isDecisionOptionsList && items.length >= 1 && instructionsStepNum === 3) {
			dispatch(AppSlice.actions.goToInstructionsStep(4));
		}
		if (!isDecisionOptionsList && items.length >= 2 && instructionsStepNum === 4) {
			dispatch(AppSlice.actions.goToInstructionsStep(5));
		}
	};

	const endOfAnimation = (index: number) => {
		if (index === localItems.length - 1) {setStopAnimation(true);}
	};

	const clearNewEntryWhenCreated = () => {
		if (items.length > 0 && items[0].name === newEntry) {setNewEntry('');}
	};

	const manageNotEnoughItemsAlerts = () => {
		if (items.length < 2) {dispatch(AppSlice.actions.addAlert(notEnoughItemsAlert));}
		else {dispatch(AppSlice.actions.deleteAlert(notEnoughItemsAlert));}
	};

	return (
		<div className={classes.divMain} data-testid={`${itemsKey}List`}>
			<Grid container justify='center' alignContent='center'>
				<Grid item xs={12}>
					<Paper className={classes.paperTitle} elevation={1} ref={paperRef} key='NewEntry'>
						<Box display='flex' alignItems='center'>
							<Box width='100%' mr={1}>
								<ComponentsTooltip title='Write new entry'>
									<Input
										inputProps={{
											'data-testid': 'entryInput',
											'aria-label': `New ${itemsType}`,
										}}
										className={classes.inputBase}
										placeholder='New Entry'
										value={newEntry}
										onKeyPress={event => {
											if (event.key === 'Enter') {
												event.preventDefault();
												onCreateItem(newEntry);
											}
										}}
										onChange={onChangeNewEntry}
										multiline
									/>
								</ComponentsTooltip>
							</Box>
							<Box width={theme.spacing(10)}>
								<ComponentsTooltip title='Add entry'>
									<IconButton
										data-testid='addButton'
										aria-label={`Create new ${itemsType}`}
										className={classes.entryButtons}
										onClick={() => onCreateItem(newEntry)}
									>
										<AddIcon />
									</IconButton>
								</ComponentsTooltip>
							</Box>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<InstructionsBox show={areInstructionsVisible} width='100%' />
				</Grid>
				{localItems.map((item, index) => (
					<Fade
						in
						style={{
							transitionDelay: `${stopAnimation ? 0 : startAnimationDelay + index * animationDelayPerItem}ms`,
						}}
						timeout={500}
						onEntered={() => endOfAnimation(index)}
						key={item.id}
					>
						<Grid item xs={12}>
							<Paper className={classes.paperItems} elevation={1}>
								<Box display='flex' alignItems='center'>
									<Box width='100%' mr={1}>
										<ComponentsTooltip title='Edit entry'>
											<Input
												inputProps={{
													'data-testid': `itemInput`,
													'aria-label': `Edit ${itemsType}`,
												}}
												className={classes.inputBase}
												value={item.name}
												onChange={event => onChangeItem(event, item.id)}
												onBlur={() => onLeaveItem(item)}
												multiline
												onKeyDown={event => {
													if (event.key === 'Enter') {
														event.preventDefault();
														if (document.activeElement instanceof HTMLElement) {
															document.activeElement.blur();
														}
													}
												}}
											/>
										</ComponentsTooltip>
									</Box>
									<Box width={theme.spacing(10)}>
										<ComponentsTooltip title='Delete entry'>
											<IconButton
												data-testid={`deleteButton${index}`}
												aria-label={`Delete ${itemsType}`}
												onClick={() => onDeleteItem(item)}
												className={classes.entryButtons}
											>
												<DeleteIcon />
											</IconButton>
										</ComponentsTooltip>
									</Box>
								</Box>
							</Paper>
						</Grid>
					</Fade>
				))}
			</Grid>
		</div>
	);
};

export default EditableList;
