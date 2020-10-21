const { __ } = wp.i18n;

import { isArray } from "lodash";

import { useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";

import GridItemPostPreview from "../../components/grid-item-post-preview/grid-item-post-preview";

const DynamicPreview = ({ config, attributes, setAttributes }) => {
  const currentPostId = useSelect((select) => {
    const { getCurrentPostId } = select("core/editor");

    const postId = getCurrentPostId();

    return postId;
  }, []);

  const posts = useSelect(
    (select) => {
      const { getEntityRecords } = select("core");

      let q = {
        status: "publish",
        per_page: attributes.noOfPosts,
        exclude: currentPostId,
        order: attributes.order,
      };

      if (attributes.taxonomy && attributes.terms) {
        q[attributes.taxonomy] = attributes.terms;
      }

      const perType = getEntityRecords("postType", attributes.postType, q);

      return perType;
    },
    [
      attributes.noOfPosts,
      attributes.postType,
      attributes.taxonomy,
      attributes.terms,
      attributes.order,
      currentPostId,
    ]
  );

  // Set defaults. Can't use
  // standard attribute defaults
  // here, becase those keys
  // won't get included in saved
  // attrs if user selects the default
  useEffect(() => {
    if (!attributes.postType) {
      setAttributes({
        postType: config.allowedPostTypes[0],
      });
    }
    if (!attributes.noOfPosts) {
      setAttributes({
        noOfPosts: isArray(config.noOfPosts)
          ? config.noOfPosts[0]
          : config.noOfPosts,
      });
    }
  }, [config, attributes.noOfPosts, attributes.postType]);


  if (!config.allowedPostTypes)
    return <span>Error: allowedPostTypes not configured</span>;


  let gridCls = `splx-grid splx-grid--listType-${config.listType}`;
  const isCol = config.listType === "horizontal";
  if (isCol) {
    gridCls += ` splx-grid--cols${config.noOfGridCols}`;
  }

  return (
    <div className="splx-wrap">
      {posts &&
        (config.listType === "horizontal" ||
          config.listType === "vertical") && (
          <div className={gridCls}>
            {posts.map((post) => {
              return (
                <GridItemPostPreview
                  key={post.id}
                  post={post}
                  config={config}
                  isCol={isCol}
                />
              );
            })}
          </div>
        )}
      {attributes.listType === "carousel" && (
        <div className={gridCls}>
          {__("Carousel preview not available.", "splx")}
        </div>
      )}
    </div>
  );
};

export default DynamicPreview;
