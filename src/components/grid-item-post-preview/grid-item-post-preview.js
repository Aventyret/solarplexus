import "./grid-item-post-preview.scss";

import GridItemPostFeaturedMediaPreview from "../grid-item-post-featured-media-preview/grid-item-post-featured-media-preview";
import GridItemPostCustomFieldsPreview from "../grid-item-post-custom-fields-preview/grid-item-post-custom-fields-preview";

const GridItemPostPreview = ({ post, config, layout, isCol }) => {
  console.log("GridItemPostPreview", post);

  let cls =
    `rdb-gridItemPostPreview rdb-gridItemPostPreview--layout-${layout}` +
    (!!post.featured_media ? " rdb-gridItemPostPreview--hasImg" : "");

  if (isCol) cls += ` rdb-gridItemPostPreview--cols${config.noOfGridCols}`;

  return (
    <div className={cls}>
      <div className="rdb-gridItemPostPreview__image">
        <GridItemPostFeaturedMediaPreview post={post} />
      </div>
      <div className="rdb-gridItemPostPreview__content">
        <h3 className="rdb-gridItemPostPreview__heading">{post.title.rendered}</h3>
        <div
          className="rdb-gridItemPostPreview__excerpt"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <GridItemPostCustomFieldsPreview config={config} post={post} />
      </div>
    </div>
  );
};

export default GridItemPostPreview;
