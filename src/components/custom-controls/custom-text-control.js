import customControlOnChange from './custom-control-on-change';

const { TextControl } = window.wp.components;

const CustomTextControl = ({
	control,
	attributes,
	setAttributes,
	searchResult,
	isPostCustomControl = false,
}) => {
	const onChange = customControlOnChange(
		attributes,
		setAttributes,
		control,
		searchResult,
		isPostCustomControl
	);

	let inputValue = attributes[control.id];

	if (isPostCustomControl) {
		const item = attributes.searchResults.find(
			(item) => item.id === searchResult.id
		);

		inputValue = item?.postCustomControls?.[control.id] ?? '';
	}

	return (
		<TextControl label={control.name} value={inputValue} onChange={onChange} />
	);
};

export default CustomTextControl;
