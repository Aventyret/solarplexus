const { __ } = wp.i18n;

import _ from "lodash";

import {
  PanelBody,
  CheckboxControl,
  RadioControl,
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";

import { useSelect } from "@wordpress/data";

const RuledDisplayBlockEdit = ({ config, attributes, setAttributes }) => {
  console.log("attributes", attributes);

  // Get all the registered post types
  const availablePostTypes = useSelect((select) => {
    const { getPostTypes } = select("core");

    const postTypes = getPostTypes();

    // Only return the ones allowed in config
    return postTypes && config.allowedPostTypes
      ? postTypes.filter((postType) => {
          return config.allowedPostTypes.includes(postType.slug);
        })
      : null;
  }, []);

  const posts = useSelect((select) => {
    const { getEntityRecords } = select("core");

    const perType = getEntityRecords("postType", attributes.postType, {
      status: "publish",
      per_page: config.noOfPosts,
    });

    return perType;
  }, [attributes.postType]);

  // const onPostTypeCheckboxChange = (postTypeSlug) => {
  //   const newSelectedPostTypes = attributes.postTypes.includes(postTypeSlug)
  //     ? attributes.postTypes.filter((_postTypeSlug) => {
  //         return _postTypeSlug !== postTypeSlug;
  //       })
  //     : [...attributes.postTypes, postTypeSlug];

  //   setAttributes({
  //     postTypes: newSelectedPostTypes,
  //   });
  // };

  const onPostTypeRadioChange = (postTypeSlug) => {
    setAttributes({
      postType: postTypeSlug,
    });
  };

  if (!config.allowedPostTypes)
    return <span>Error: allowedPostTypes not configured</span>;

  const inspectorControls = (
    <InspectorControls>
      {availablePostTypes && availablePostTypes.length && (
        <PanelBody title={__("Post types", "rdb")}>
          <RadioControl
            label={__("Show posts from:", "rdb")}
            selected={attributes.postType}
            options={availablePostTypes.map((postType) => {
              return { label: postType.name, value: postType.slug };
            })}
            onChange={(value) => onPostTypeRadioChange(value)}
          />
          {/* {availablePostTypes.map((postType) => {
            return (
              <CheckboxControl
                key={postType.slug}
                onChange={() => onPostTypeCheckboxChange(postType.slug)}
                label={postType.name}
                checked={attributes.postTypes.includes(postType.slug)}
              />
            );
          })} */}
        </PanelBody>
      )}
    </InspectorControls>
  );

  return (
    <div className="rdb-wrap">
      {inspectorControls}
      Block w config from json first test. <pre>title</pre> from config is{" "}
      <span className="rdb-test">{config.title}</span>
      {posts && (
        <ul>
          {posts.map((post) => {
            return <li key={post.id}>{post.title.rendered}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default RuledDisplayBlockEdit;
