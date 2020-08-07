import "./ruled-display-block.scss";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";


registerBlockType("rdb/ruled-display-block", {
  title: "Ruled display block",
  icon: "universal-access-alt",
  category: "layout",
  example: {},
  edit() {
    return (
      <div className="rdb-wrap">
        Block w config from json first test. <pre>title</pre> from config is{" "}
        <span className="rdb-test">{ruledDisplayBlockConfig.title}</span>
      </div>
    );
  },
  save() {
    return null;
  },
});
