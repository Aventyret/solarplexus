import { TextareaControl } from '@wordpress/components';
import customControlInputValue from './custom-control-input-value';

const CustomTextareaControl = ({
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

	const value = inputValue !== null ? inputValue : '';

	return (
		<TextareaControl label={control.name} value={value} onChange={onChange} />
	);
};

export default CustomTextareaControl;
