const { __ } = wp.i18n;

import { PanelBody, CheckboxControl } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";

import { useSelect } from "@wordpress/data";

const RuledDisplayBlockEdit = ({ config, attributes, setAttributes }) => {
  console.log("attributes", attributes);
  const availablePostTypes = useSelect((select) => {
    const { getPostTypes } = select("core");

    const postTypes = getPostTypes();
    return postTypes && config.allowedPostTypes
      ? postTypes.filter((postType) => {
          return config.allowedPostTypes.includes(postType.slug);
        })
      : null;
  });

  const onPostTypeCheckboxChange = (postTypeSlug) => {
    const newSelectedPostTypes = attributes.postTypes.includes(postTypeSlug)
      ? attributes.postTypes.filter((_postTypeSlug) => {
          return _postTypeSlug !== postTypeSlug;
        })
      : [...attributes.postTypes, postTypeSlug];

    setAttributes({
      postTypes: newSelectedPostTypes,
    });
  };

  if (!config.allowedPostTypes)
    return <span>Error: allowedPostTypes not configured</span>;

  const inspectorControls = (
    <InspectorControls>
      {availablePostTypes ? (
        <PanelBody title={__("Post types", "rdb")}>
          {availablePostTypes.map((postType) => {
            return (
              <CheckboxControl
                key={postType.slug}
                onChange={() => onPostTypeCheckboxChange(postType.slug)}
                label={postType.name}
                checked={attributes.postTypes.includes(postType.slug)}
              />
            );
          })}
        </PanelBody>
      ) : null}
    </InspectorControls>
  );

  return (
    <div className="rdb-wrap">
      {inspectorControls}
      Block w config from json first test. <pre>title</pre> from config is{" "}
      <span className="rdb-test">{config.title}</span>
      {/* {attributes.postTypes.map((postType) => {
        return <span key={postType}>{postType}</span>;
      })} */}
    </div>
  );
};

export default RuledDisplayBlockEdit;
