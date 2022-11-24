import { Button, Fade, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { NOT_ENOUGH_PRODUCTS } from 'constants/Alerts';
import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AppSlice from 'services/redux/actionsAndSlicers/AppSlice';
import ProductSelectionSlice from 'services/redux/actionsAndSlicers/ProductSelectionSlice';
import { fetchProducts } from 'services/redux/actionsAndSlicers/ProductSlice';
import { RootState } from 'services/redux/rootReducer';
import { useEffectUnsafe } from 'services/unsafeHooks';
import ProductItem from './components/ProductItem';


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

const ProductSelection: React.FC = () => {
	const { products } = useSelector((state: RootState) => state.Product, shallowEqual);

	const ACTION_BUTTON_LABEL = 'Thêm vào giỏ hàng';
	const ACTION_BUTTON_REMOVE_LABEL = 'Xóa khỏi giỏ hàng';

	const classes = useStyles();

	const productSelection = useSelector((state: RootState) => state.ProductSelection, shallowEqual);

	const { selectedProducts } = productSelection
	const dispatch = useDispatch();

	dispatch(fetchProducts());

	const manageNotEnoughItemsAlerts = () => {
		if (selectedProducts.length < 1) {
			dispatch(AppSlice.actions.addAlert(NOT_ENOUGH_PRODUCTS));
		}
		else { dispatch(AppSlice.actions.deleteAlert(NOT_ENOUGH_PRODUCTS)); }
	};

	useEffectUnsafe(() => {
		manageNotEnoughItemsAlerts();
	}, [selectedProducts]);

	const startAnimationDelay = 400;
	const animationDelayPerItem = 200;
	const [stopAnimation, setStopAnimation] = useState(false);

	const endOfAnimation = (index: number) => {
		if (index === products.length - 1) { setStopAnimation(true); }
	};

	return (
		<div className={classes.divMain}>
			<Grid container justify='center' alignContent='center'>
				{products.map((product, index) => {
					const isSelected = selectedProducts?.filter(selectedProduct => selectedProduct.id === product.id)?.length > 0

					// action callback
					const actionCallback = isSelected
						? () => dispatch(ProductSelectionSlice.actions.deleteSelectedProduct(product.id))
						: () => dispatch(ProductSelectionSlice.actions.addSelectedProduct(product))

					return <>
						<Fade
							in
							style={{
								transitionDelay: `${stopAnimation ? 0 : startAnimationDelay + index * animationDelayPerItem}ms`,
							}}
							timeout={500}
							onEntered={() => endOfAnimation(index)}
							key={product.id}
						>
							<Grid item xs={3} className={classes.gridItem}>
								<ProductItem product={product} actionComponent={getActionButton(
									ACTION_BUTTON_LABEL,
									ACTION_BUTTON_REMOVE_LABEL,
									isSelected,
									actionCallback,
									false
								)} />
							</Grid>
						</Fade>
					</>
				})}
			</Grid>
		</div>
	);
};

function getActionButton(
	label: string,
	selectedLabel: string,
	isSelected: boolean,
	clickCallBack: () => void,
	disabled?: boolean
) {
	if (isSelected) {
		return (
			<>
				<Button
					color="primary"
					disabled={disabled}
					fullWidth
					onClick={clickCallBack}
					size="large"
					variant="outlined"
				>
					{selectedLabel}
				</Button>
			</>
		)
	}

	return (
		<Button
			color="secondary"
			disabled={disabled}
			fullWidth
			onClick={clickCallBack}
			size="large"
			variant="contained"
		>
			{label}
		</Button>
	)
}

export default ProductSelection;
