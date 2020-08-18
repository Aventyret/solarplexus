import "./ruled-display-block.scss";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import { InspectorControls } from "@wordpress/block-editor";

import { TabPanel } from "@wordpress/components";

import Edit from "./edit";

registerBlockType("rdb/ruled-display-block", {
  title: "Ruled display block",
  icon: "universal-access-alt",
  category: "layout",
  example: {},
  attributes: {
    postType: {
      type: "string",
      default: ""
    },
    taxonomy: {
      type: "string",
      default: ""
    },
    terms: {
      type: "array",
      default: []
    },
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
