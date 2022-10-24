import { PanelBody, SelectControl } from '@wordpress/components';

const CustomSelectControl = ( { control, attributes, setAttributes } ) => {
	const onChange = ( val ) => {
		setAttributes( {
			[ control.id ]: val,
		} );
	};

	return (
		<PanelBody>
			<SelectControl
				label={ control.name }
				value={ attributes[ control.id ] }
				onChange={ onChange }
				options={ control.choices.map( ( { value, label } ) => {
					return {
						value,
						label,
					};
				} ) }
			/>
		</PanelBody>
	);
};

export default CustomSelectControl;
