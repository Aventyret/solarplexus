import { stretchWide, chevronUp, chevronLeft } from '@wordpress/icons';

const { __ } = window.wp.i18n;

// TODO better icons
export const ITEM_LAYOUTS = {
	imagebg: {
		label: __('Image as background', 'solarplexus'),
		icon: stretchWide,
	},
	imagetop: { label: __('Image on top', 'solarplexus'), icon: chevronUp },
	imageleft: {
		label: __('Image to the left', 'solarplexus'),
		icon: chevronLeft,
	},
};

export const ORDERBYS = {
	date: __('Date', 'solarplexus'),
	title: __('Title', 'solarplexus'),
	menu_order: __('Menu order', 'solarplexus'),
	meta_value: __('Post meta', 'solarplexus'),
	meta_value_num: __('Post meta, numeric', 'solarplexus'),
};

export const ORDERS = {
	asc: __('Ascending', 'solarplexus'),
	desc: __('Descending', 'solarplexus'),
};
