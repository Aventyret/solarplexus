import { useCallback } from 'react';

const customControlOnChange = (
	attributes,
	setAttributes,
	control,
	searchResult,
	isPostCustomControl
) => {
	const onChange = useCallback(
		(val) => {
			if (isPostCustomControl) {
				// Add the value to the search result for current the searchResult.id
				const newSearchResults = attributes.searchResults.map((result) => {
					if (result.id === searchResult.id) {
						return {
							...result,
							postCustomControls: {
								...result.postCustomControls,
								[control.id]: val,
							},
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
		},
		[attributes, setAttributes, control, searchResult, isPostCustomControl]
	);

	return onChange;
};

export default customControlOnChange;
