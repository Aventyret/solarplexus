import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import Edit from "./edit";

registerBlockType("rdb/handpicked-display-block", {
  title: "Handpicked display block",
  icon: "universal-access-alt",
  category: "layout",
  example: {},
  attributes: {
    layout: {
      type: "string",
      default: ruledDisplayBlockConfig.allowedLayouts[0]
    },
    itemLayout: {
      type: "string",
      default: ruledDisplayBlockConfig.allowedItemLayouts[0]
    }
  },
  edit(props) {
    return (
      <Edit config={ruledDisplayBlockConfig} {...props} />
    );
  },
  save() {
    return null;
  },
});
