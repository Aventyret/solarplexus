import { TextControl } from '@wordpress/components';
import customControlInputValue from './custom-control-input-value';

const CustomTextControl = ({
	control,
	attributes,
	setAttributes,
	searchResult,
	isPostCustomControl = false,
}) => {
	const onChange = (val) => {
		if (isPostCustomControl) {
			// Add the value to the search result for current the searchResult.id
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
		<TextControl label={control.name} value={inputValue} onChange={onChange} />
	);
};

export default CustomTextControl;
