import "./grid-item-post-featured-media-preview.scss";

import { useEffect, useState } from "@wordpress/element";

const GridItemPostFeaturedMediaPreview = ({ post, config }) => {
  const featuredMediaLink =
    post._links["wp:featuredmedia"] && post._links["wp:featuredmedia"][0].href;
  const [featuredMedia, setFeaturedMedia] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const res = await fetch(featuredMediaLink);
      const json = await res.json();
      setFeaturedMedia(json);
    };
    if (featuredMediaLink) fetchMedia();
  }, [featuredMediaLink, setFeaturedMedia]);

  const cls = `splx-gridItemPostFeaturedMediaPreview splx-gridItemPostFeaturedMediaPreview--layout-${config.itemLayout}`;

  return featuredMedia ? (
    <div className={cls}>
      <img src={featuredMedia.source_url} alt={featuredMedia.alt_text} />
    </div>
  ) : null;
};

export default GridItemPostFeaturedMediaPreview;
