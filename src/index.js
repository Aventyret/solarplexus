import "./shared.scss";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import DynamicDisplayBlockEdit from "./components/dynamic-display-block-edit/dynamic-display-block-edit";
import HandPickedDisplayBlockEdit from "./components/hand-picked-display-block-edit/hand-picked-display-block-edit";

ruledDisplayBlockConfig.forEach((config) => {

  const commonAttributes = {
    layout: {
      type: "string",
      default: config.allowedLayouts[0],
    },
    itemLayout: {
      type: "string",
      default: config.allowedItemLayouts[0],
    },
  };
  const attributes =
    config.type === "dynamic"
      ? {
          ...commonAttributes,
          postType: {
            type: "string",
            default: "",
          },
          taxonomy: {
            type: "string",
            default: "",
          },
          terms: {
            type: "array",
            default: [],
          },
        }
      : config.type === "handpicked"
      ? {
          ...commonAttributes,
          searchResults: {
            type: "array",
            default: [],
          },
        }
      : {};
  registerBlockType(`rdb/${config.id}`, {
    title: config.title,
    icon: "universal-access-alt",
    category: "layout",
    example: {},
    attributes,
    edit(props) {
      return config.type === "dynamic" ? (
        <DynamicDisplayBlockEdit config={config} {...props} />
      ) : config.type === "handpicked" ? (
        <HandPickedDisplayBlockEdit config={config} {...props} />
      ) : null;
    },
    save() {
      return null;
    },
  });
});
