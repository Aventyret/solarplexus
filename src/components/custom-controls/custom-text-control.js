import { PanelBody, TextControl } from '@wordpress/components';

const CustomTextControl = ({ control, attributes, setAttributes }) => {
	const onChange = (val) => {
		setAttributes({
			[control.id]: val,
		});
	};

	return (
		<TextControl
			label={control.name}
			value={attributes[control.id]}
			onChange={onChange}
		/>
	);
};

export default CustomTextControl;
