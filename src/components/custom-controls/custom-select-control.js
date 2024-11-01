import customControlOnChange from './custom-control-on-change';

const { SelectControl } = window.wp.components;

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

	let inputValue = attributes[control.id];

	if (isPostCustomControl) {
		const item = attributes.searchResults.find(
			(item) => item.id === searchResult.id
		);

		inputValue = item?.postCustomControls?.[control.id] ?? '';
	}

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
