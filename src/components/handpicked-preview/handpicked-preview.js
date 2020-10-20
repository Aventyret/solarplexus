import "./handpicked-preview.scss";

const { __ } = wp.i18n;

import { useEffect, useState } from "@wordpress/element";

import GridItemPostPreview from "../../components/grid-item-post-preview/grid-item-post-preview";

const SearchResultPreview = ({ config, attributes, isCol, getUrl }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      const res = await fetch(getUrl);
      const json = await res.json();
      if (json.id) setPost(json);
    };
    if (getUrl) getPost();
  }, [getUrl, setPost]);

  if (!post) return null;

  return <GridItemPostPreview post={post} config={config} isCol={isCol} />;
};

const HandpickedPreview = ({ config, attributes, isDirty }) => {
  let gridCls = `splx-grid splx-grid--listType-${config.listType}`;
  const isCol = config.listType === "horizontal";
  if (isCol) {
    gridCls += ` splx-grid--cols${config.noOfGridCols}`;
  }

  return (
    <div className="splx-wrap">
      {!isDirty && !attributes.searchResults.length && (
        <p>
          {__("Start by searching for posts in the panel to the right", "splx")}
        </p>
      )}

      {attributes.searchResults &&
        (config.listType === "horizontal" ||
          config.listType === "vertical") && (
          <div className={gridCls}>
            {attributes.searchResults.map((searchResult) => (
              <SearchResultPreview
                key={searchResult.id}
                config={config}
                attributes={attributes}
                postId={searchResult.id}
                getUrl={searchResult._links.self[0].href}
                isCol={isCol}
              />
            ))}
          </div>
        )}
      {config.listType === "carousel" && (
        <div className={gridCls}>
          {__("Carousel preview not available.", "splx")}
        </div>
      )}
    </div>
  );
};

export default HandpickedPreview;
