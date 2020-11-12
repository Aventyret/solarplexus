import { PanelBody, TextControl } from "@wordpress/components";

const CustomTextControl = ({ control, attributes, setAttributes }) => {
  const onChange = (val) => {
    setAttributes({
      [control.id]: val,
    });
  };

  return (
    <PanelBody>
      <TextControl
        label={control.name}
        value={attributes[control.id]}
        onChange={onChange}
      />
    </PanelBody>
  );
};

export default CustomTextControl;
