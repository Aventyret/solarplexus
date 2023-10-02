import { TextareaControl } from '@wordpress/components';

const CustomTextareaControl = ({ control, attributes, setAttributes }) => {
	const onChange = (val) => {
		setAttributes({
			[control.id]: val,
		});
	};

	return (
		<TextareaControl
			label={control.name}
			value={attributes[control.id]}
			onChange={onChange}
		/>
	);
};

export default CustomTextareaControl;
