import "./shared.scss";

import { useState } from "@wordpress/element";

import ServerSideRender from "@wordpress/server-side-render";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import DynamicPreview from "./components/dynamic-preview/dynamic-preview";
import DynamicInspectorControls from "./components/dynamic-inspector-controls/dynamic-inspector-controls";
import HandpickedPreview from "./components/handpicked-preview/handpicked-preview";
import HandpickedInspectorControls from "./components/handpicked-inspector-controls/handpicked-inspector-controls";

// solarplexusConfig and solarplexusAttrDefs
// are global window variables
// outputted in class-solarplexus-admin.php

solarplexusConfig.forEach((config) => {
  const blockId = `splx/${config.id}`;
  const attributes = solarplexusAttrDefs[config.id];
  if(!attributes) {
    console.error(`Solarplexus: No attributes found for ${attributes}, skipping`);
    return;
  }
  console.log(`Solarplexus: Attributes for ${config.id}`, attributes);
  registerBlockType(blockId, {
    title: config.title,
    icon: "universal-access-alt",
    category: "layout",
    example: {},
    attributes,
    edit(props) {
      const [isDirty, setIsDirty] = useState(false);
      const isSSR = config.serverSideRenderedPreview;

      return (
        <>
          {config.type === "dynamic" ? (
            <DynamicInspectorControls {...props} config={config} />
          ) : config.type === "handpicked" ? (
            <HandpickedInspectorControls {...props} config={config} setIsDirty={setIsDirty} />
          ) : null}
          
          {isSSR ? (
            <ServerSideRender attributes={props.attributes} block={blockId} />
          ) : config.type === "dynamic" ? (
            <DynamicPreview config={config} {...props} />
          ) : config.type === "handpicked" ? (
            <HandpickedPreview config={config} {...props} isDirty={isDirty} />
          ) : null}
        </>
      );
    },
    save() {
      return null;
    },
  });
});
