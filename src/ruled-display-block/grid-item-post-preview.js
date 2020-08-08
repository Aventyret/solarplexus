import "./grid-item-post-preview.scss";

import { useEffect, useState } from "@wordpress/element";

const GridItemPostPreview = ({ post, config }) => {
  const featuredMediaLink =
    post._links["wp:featuredmedia"] && post._links["wp:featuredmedia"][0].href;
  const [featuredMedia, setFeaturedMedia] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      console.log("featuredMediaLink", featuredMediaLink);
      const res = await fetch(featuredMediaLink);
      const json = await res.json();
      setFeaturedMedia(json);
    };
    if (featuredMediaLink) fetchMedia();
  }, [featuredMediaLink, setFeaturedMedia]);

  console.log("GridItemPostPreview", post);
  console.log("GridItemPostPreview featuredMedia", featuredMedia);

  const cls =
    `rdb-gridItemPostPreview rdb-gridItemPostPreview--cols${config.noOfGridCols}` +
    (!!featuredMedia ? " rdb-gridItemPostPreview--hasImg" : "");
  return (
    <div className={cls}>
      {featuredMedia && (
        <div className="rdb-gridItemPostPreview__img">
          <img src={featuredMedia.source_url} alt={featuredMedia.alt_text} />
        </div>
      )}

      <div className="rdb-gridItemPostPreview__content">
        <h3>{post.title.rendered}</h3>
        <div
          className="rdb-gridItemPostPreview__excerpt"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
      </div>
    </div>
  );
};

export default GridItemPostPreview;
