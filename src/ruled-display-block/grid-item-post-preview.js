import "./grid-item-post-preview.scss";

import GridItemPostFeaturedMediaPreview from "./grid-item-post-featured-media-preview";
import GridItemPostCustomFieldsPreview from "./grid-item-post-custom-fields-preview";

const GridItemPostPreview = ({ post, config }) => {
  console.log("GridItemPostPreview", post);

  const cls =
    `rdb-gridItemPostPreview rdb-gridItemPostPreview--cols${config.noOfGridCols}` +
    (!!post.featured_media ? " rdb-gridItemPostPreview--hasImg" : "");
  return (
    <div className={cls}>
      <GridItemPostFeaturedMediaPreview post={post} />
      <div className="rdb-gridItemPostPreview__content">
        <h3>{post.title.rendered}</h3>
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
