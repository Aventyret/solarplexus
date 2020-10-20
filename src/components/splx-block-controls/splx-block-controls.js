import { Toolbar, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { BlockControls } from "@wordpress/block-editor";

import { LAYOUTS, ITEM_LAYOUTS } from "../../consts";

// Not used atm as layout (listtypes)
// and itemLayouts are fixed values in
// config per block and doesnt need
// editor controls.

const SplxBlockControls = ({ config, attributes, setAttributes }) => {
  const onLayoutButtonClick = (layout) => {
    setAttributes({ layout });
  };

  const onItemLayoutButtonClick = (itemLayout) => {
    setAttributes({ itemLayout });
  };
  return (
    <BlockControls>
      <Toolbar>
        <ToolbarGroup>
          {config.allowedLayouts.map((layout) => (
            <ToolbarButton
              key={layout}
              label={LAYOUTS[layout].label}
              icon={LAYOUTS[layout].icon}
              title={LAYOUTS[layout].label}
              onClick={() => onLayoutButtonClick(layout)}
              isActive={attributes.layout === layout}
            />
          ))}
        </ToolbarGroup>
        <ToolbarGroup>
          {config.allowedItemLayouts.map((itemLayout) => (
            <ToolbarButton
              key={itemLayout}
              label={ITEM_LAYOUTS[itemLayout].label}
              icon={ITEM_LAYOUTS[itemLayout].icon}
              title={ITEM_LAYOUTS[itemLayout].label}
              onClick={() => onItemLayoutButtonClick(itemLayout)}
              isActive={attributes.itemLayout === itemLayout}
            />
          ))}
        </ToolbarGroup>
      </Toolbar>
    </BlockControls>
  );
};

export default SplxBlockControls;
