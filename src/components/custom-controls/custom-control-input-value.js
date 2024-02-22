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
			const itemIndex = attributes.searchResults.findIndex((item) => {
				return item.id === searchResult.id;
			});

			value = attributes.searchResults[itemIndex][control.id];
		}

		setInputValue(value);
	}, [attributes, control, searchResult, isPostCustomControl]);

	return inputValue;
};

export default customControlInputValue;
