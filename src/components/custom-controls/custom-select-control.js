import { SelectControl } from '@wordpress/components';
import customControlInputValue from './custom-control-input-value';

const CustomSelectControl = ({
	control,
	attributes,
	setAttributes,
	searchResult,
	isPostCustomControl = false,
}) => {
	const onChange = (val) => {
		if (isPostCustomControl) {
			// Add the value to the search result for the current searchResult.id
			const newSearchResults = attributes.searchResults.map((result) => {
				if (result.id === searchResult.id) {
					return {
						...result,
						[control.id]: val,
					};
				}
				return result;
			});

			setAttributes({
				searchResults: newSearchResults,
			});
		} else {
			setAttributes({
				[control.id]: val,
			});
		}
	};

	const inputValue = customControlInputValue(
		attributes,
		control,
		searchResult,
		isPostCustomControl
	);

	return (
		<SelectControl
			label={control.name}
			value={inputValue}
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
