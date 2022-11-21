export enum AlertTypes {
	error = 'error',
	warning = 'warning',
	info = 'info',
	success = 'success',
}


export type AlertType = {
	type: AlertTypes;
	allowClose: boolean;
	autoHide: boolean;
	text: string;
};

export const AlertInitialState: AlertType = {
	type: AlertTypes.error,
	allowClose: true,
	autoHide: false,
	text: '',
};

export const NOT_ENOUGH_PRODUCTS: AlertType = {
	type: AlertTypes.info,
	allowClose: false,
	autoHide: true	,
	text: 'Vui lòng chọn ít nhất một sản phẩm! ',
};

export const NOT_ENOUGH_CONTACT: AlertType = {
	type: AlertTypes.info,
	allowClose: false,
	autoHide: true	,
	text: 'Vui lòng điền thông tin liên lạc! ',
};
