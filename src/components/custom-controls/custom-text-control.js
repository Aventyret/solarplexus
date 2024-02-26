import { TextControl } from '@wordpress/components';
import customControlInputValue from './custom-control-input-value';
import customControlOnChange from './custom-control-on-change';

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

	const inputValue = customControlInputValue(
		attributes,
		control,
		searchResult,
		isPostCustomControl
	);

	const value = inputValue !== null ? inputValue : '';

	return <TextControl label={control.name} value={value} onChange={onChange} />;
};

export default CustomTextControl;
