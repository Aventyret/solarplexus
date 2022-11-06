import { PanelBody, TextareaControl } from '@wordpress/components';

const CustomTextareaControl = ({ control, attributes, setAttributes }) => {
	const onChange = (val) => {
		setAttributes({
			[control.id]: val,
		});
	};

	return (
		<PanelBody>
			<TextareaControl
				label={control.name}
				value={attributes[control.id]}
				onChange={onChange}
			/>
		</PanelBody>
	);
};

export default CustomTextareaControl;
