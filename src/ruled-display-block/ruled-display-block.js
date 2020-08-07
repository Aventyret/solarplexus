import "./ruled-display-block.scss";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import { InspectorControls } from "@wordpress/block-editor";

import { TabPanel } from "@wordpress/components";

import RuledDisplayBlockEdit from "./edit";

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
  },
  edit(props) {
    return (
      <RuledDisplayBlockEdit config={ruledDisplayBlockConfig} {...props} />
    );
  },
  save() {
    return null;
  },
});
