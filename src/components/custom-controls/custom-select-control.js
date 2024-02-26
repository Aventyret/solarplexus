import { SelectControl } from '@wordpress/components';
import customControlInputValue from './custom-control-input-value';
import customControlOnChange from './custom-control-on-change';

const CustomSelectControl = ({
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

	return (
		<SelectControl
			label={control.name}
			value={value}
			onChange={onChange}
			options={control.choices.map(({ value, label }) => {
				return {
					value,
					label,
				};
			})}
		/>
	);
};

export default CustomSelectControl;
