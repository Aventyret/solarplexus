import CustomSelectControl from "./custom-select-control"
import CustomTextControl from "./custom-text-control"
import CustomTextareaControl from "./custom-textarea-control"

const CustomControls = ({ attributes, setAttributes, config }) => {
  if (!config.customControls || !config.customControls.length) {
    return null;
  }

  return config.customControls.map((control) => {
    if (control.type === "select") {
      return (
        <CustomSelectControl
          key={control.id}
          attributes={attributes}
          setAttributes={setAttributes}
          control={control}
        />
      );
    }
    if (control.type === "text") {
      return (
        <CustomTextControl
          key={control.id}
          attributes={attributes}
          setAttributes={setAttributes}
          control={control}
        />
      );
    }
    if (control.type === "textarea") {
      return (
        <CustomTextareaControl
          key={control.id}
          attributes={attributes}
          setAttributes={setAttributes}
          control={control}
        />
      );
    }
    return null;
  });
};

export default CustomControls;
