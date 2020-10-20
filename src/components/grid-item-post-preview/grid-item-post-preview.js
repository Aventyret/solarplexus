import "./grid-item-post-preview.scss";

import { dateI18n, __experimentalGetSettings } from "@wordpress/date";

import GridItemPostFeaturedMediaPreview from "../grid-item-post-featured-media-preview/grid-item-post-featured-media-preview";
import GridItemPostCustomFieldsPreview from "../grid-item-post-custom-fields-preview/grid-item-post-custom-fields-preview";

const GridItemPostPreview = ({ post, config, isCol }) => {
  const layout = config.itemLayout;
  let cls =
    `splx-gridItemPostPreview splx-gridItemPostPreview--layout-${layout}` +
    (!!post.featured_media ? " splx-gridItemPostPreview--hasImg" : "");

  if (isCol) cls += ` splx-gridItemPostPreview--cols${config.noOfGridCols}`;

  const dateSettings = __experimentalGetSettings();

  return (
    <div className={cls}>
      <div className="splx-gridItemPostPreview__image">
        <GridItemPostFeaturedMediaPreview post={post} />
      </div>
      <div className="splx-gridItemPostPreview__content">
        <h3 className="splx-gridItemPostPreview__heading">
          {post.title.rendered}
        </h3>
        {config.showExcerpt && post.excerpt.rendered ? (
          <div
            className="splx-gridItemPostPreview__excerpt"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
        ) : null}

        {config.showDate ? (
          <div className="splx-gridItemPostPreview__date">
            {dateI18n(dateSettings.formats.date, post.date)}
          </div>
        ) : null}
        <GridItemPostCustomFieldsPreview config={config} post={post} />
      </div>
    </div>
  );
};

export default GridItemPostPreview;
