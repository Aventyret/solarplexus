import CustomSelectControl from "./custom-select-control"
import CustomTextControl from "./custom-text-control"

const CustomControls = ({ attributes, setAttributes, config }) => {
  if (
    !config.customControls ||
    (config.customControls && !config.customControls.length)
  )
    return null;

  return config.customControls.map((control) => {
    if (control.choices) {
      return (
        <CustomSelectControl
          key={control.id}
          attributes={attributes}
          setAttributes={setAttributes}
          control={control}
        />
      );
    } else {
      return (
        <CustomTextControl
          key={control.id}
          attributes={attributes}
          setAttributes={setAttributes}
          control={control}
        />
      );
    }
  });
};

export default CustomControls;
