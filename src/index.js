import "./shared.scss";

import { useState } from "@wordpress/element";

import ServerSideRender from "@wordpress/server-side-render";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import DynamicInspectorControls from "./components/dynamic-inspector-controls/dynamic-inspector-controls";
import HandpickedInspectorControls from "./components/handpicked-inspector-controls/handpicked-inspector-controls";

// solarplexusConfig and solarplexusAttrDefs
// are global window variables
// outputted in class-solarplexus-admin.php

const getCustomSvgJsx = (icon) => {
  return function() {
    return <span dangerouslySetInnerHTML={{ __html: icon }} />;
  };
};

solarplexusConfig.forEach((config) => {
  const blockId = `splx/${config.id}`;
  const attributes = solarplexusAttrDefs[config.id];
  if (!attributes) {
    console.error(
      `Solarplexus: No attributes found for ${attributes}, skipping`
    );
    return;
  }
  console.log(`Solarplexus: Attributes for ${config.id}`, attributes);

  const icon = config.icon
    ? config.icon.indexOf("<svg") === 0
      ? getCustomSvgJsx(config.icon)
      : config.icon
    : "universal-access-alt";

  registerBlockType(blockId, {
    title: config.title,
    icon: icon,
    category: "layout",
    example: {},
    attributes,
    edit(props) {
      const [isDirty, setIsDirty] = useState(false);

      return (
        <>
          {config.type === "dynamic" ? (
            <DynamicInspectorControls {...props} config={config} />
          ) : config.type === "handpicked" ? (
            <HandpickedInspectorControls
              {...props}
              config={config}
              setIsDirty={setIsDirty}
            />
          ) : null}

          <ServerSideRender attributes={props.attributes} block={blockId} />
        </>
      );
    },
    save() {
      return null;
    },
  });
});
