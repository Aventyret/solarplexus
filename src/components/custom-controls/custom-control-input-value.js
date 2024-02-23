import { useState, useEffect } from 'react';

const customControlInputValue = (
	attributes,
	control,
	searchResult,
	isPostCustomControl
) => {
	const [inputValue, setInputValue] = useState(null);

	useEffect(() => {
		let value = attributes[control.id];

		if (isPostCustomControl) {
			const item = attributes.searchResults.find(
				(item) => item.id === searchResult.id
			);

			if (item?.postCustomControls?.[control.id]) {
				value = item.postCustomControls[control.id];
				console.log('control.id', control.id);
				console.log('value', value);
			} else {
				value = '';
				console.log('control.id', control.id);
			}
		}

		setInputValue(value);
	}, [attributes, control, searchResult, isPostCustomControl]);

	return inputValue;
};

export default customControlInputValue;
