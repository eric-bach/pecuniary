export type instructionsType = {
	stepNum: number;
	arrowPos: 'top' | 'right' | 'bottom';
	arrowOffset: number | string;
	isArrowOffsetDirectionInverted: boolean;
	text: JSX.Element;
};

export const instructions: instructionsType[] = [
];
