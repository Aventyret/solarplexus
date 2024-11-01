import { stretchWide, chevronUp, chevronLeft } from '@wordpress/icons';

const { __ } = window.wp.i18n;

// TODO better icons
export const ITEM_LAYOUTS = {
	imagebg: { label: __('Image as background', 'splx'), icon: stretchWide },
	imagetop: { label: __('Image on top', 'splx'), icon: chevronUp },
	imageleft: { label: __('Image to the left', 'splx'), icon: chevronLeft },
};

export const ORDERBYS = {
	date: __('Date', 'splx'),
	title: __('Title', 'splx'),
	menu_order: __('Menu order', 'splx'),
	meta_value: __('Post meta', 'splx'),
	meta_value_num: __('Post meta, numeric', 'splx'),
};

export const ORDERS = {
	asc: __('Ascending', 'splx'),
	desc: __('Descending', 'splx'),
};
