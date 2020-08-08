import "./grid-item-post-featured-media-preview.scss";

import { useEffect, useState } from "@wordpress/element";

const GridItemPostFeaturedMediaPreview = ({ post }) => {
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

  console.log("GridItemPostFeaturedMediaPreview", featuredMedia);

  return featuredMedia ? (
    <div className="rdb-gridItemPostFeaturedMediaPreview">
      <img src={featuredMedia.source_url} alt={featuredMedia.alt_text} />
    </div>
  ) : null;
};

export default GridItemPostFeaturedMediaPreview;
