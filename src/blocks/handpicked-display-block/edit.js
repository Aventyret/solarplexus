import "./edit.scss";

const { __, sprintf } = wp.i18n;

import { debounce, find, findIndex } from "lodash";

import { useEffect, useState } from "@wordpress/element";

import {
  PanelBody,
  TextControl,
  Card,
  CardBody,
  Button,
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";

import GridItemPostPreview from "../../components/grid-item-post-preview/grid-item-post-preview";
import RdbBlockControls from "../../components/rdb-block-controls/rdb-block-controls";

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

  return (
    <GridItemPostPreview
      post={post}
      config={config}
      layout={attributes.itemLayout}
      isCol={isCol}
    />
  );
};

const Edit = ({ config, attributes, setAttributes }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const search = async () => {
      const res = await fetch(`/wp-json/wp/v2/search?search=${searchInput}`);
      const json = await res.json();
      setSearchResults(json);
    };
    if (searchInput.length > 2) search();
  }, [searchInput]);

  const onSearchInputChange = debounce((value) => {
    setSearchInput(value);
    setIsDirty(true);
  }, 250);

  const selectSearchResult = (searchResult) => {
    setAttributes({
      searchResults: [...attributes.searchResults, searchResult],
    });
  };

  const move = (itemId, isUp) => {
    const itemIndex = findIndex(attributes.searchResults, (searchResult) => {
      return searchResult.id === itemId;
    });
    if (itemIndex === -1 || (isUp && itemIndex === 0)) return;

    const items = [...attributes.searchResults];

    if (!isUp && itemIndex === items.length - 1) return;
    // clearTimeout(animateTimeout);

    // const newArr = items.map(item => {
    //   return { ...item, animate: false };
    // });
    const newArr = items;
    const newIndex = isUp ? itemIndex - 1 : itemIndex + 1;
    const firstItem = items[itemIndex];
    newArr[itemIndex] = items[newIndex];
    // newArr[newIndex] = { ...firstItem, animate: true };
    newArr[newIndex] = firstItem;
    // animateTimeout = setTimeout(() => {
    //   debugLog("running animate timeout");
    //   setItems(
    //     newArr.map((item) => {
    //       return { ...item, animate: false };
    //     })
    //   );
    // }, 1000);
    setAttributes({
      searchResults: newArr,
    });
  };

  const moveSearchResultUp = (searchResultId) => {
    move(searchResultId, true);
  };
  const moveSearchResultDown = (searchResultId) => {
    move(searchResultId, false);
  };
  const removeSearchResult = (searchResultId) => {
    setAttributes({
      searchResults: attributes.searchResults.filter((searchResult) => {
        return searchResult.id !== searchResultId;
      }),
    });
  };

  const inspectorControls = (
    <InspectorControls>
      <PanelBody>
        <h4>{__("Search", "rdb")}</h4>
        <TextControl onChange={(nextValue) => onSearchInputChange(nextValue)} />
        <ul>
          {searchResults.map((searchResult) => {
            const alreadySelected = !!find(
              attributes.searchResults,
              (_searchResult) => {
                return searchResult.id === _searchResult.id;
              }
            );

            const maxReached =
              attributes.searchResults.length >= config.noOfPosts;
            return (
              <li className="rdb-searchResult" key={searchResult.id}>
                <span>{searchResult.title}</span>
                <Button
                  isSecondary
                  isSmall
                  disabled={alreadySelected || maxReached}
                  onClick={() => selectSearchResult(searchResult)}
                >
                  {alreadySelected
                    ? __("Already selected", "rdb")
                    : maxReached
                    ? sprintf(__("You can't select more than %d posts", "rdb"), config.noOfPosts)
                    : __("Select", "rdb")}
                </Button>
              </li>
            );
          })}
        </ul>
        {attributes.searchResults.length ? (
          <div className="rdb-selectedSearchResultsWrap">
            <h4>{__("Selected posts", "rdb")}</h4>
            <div className="rdb-selectedSearchResults">
              {attributes.searchResults.map((searchResult) => {
                return (
                  <Card key={searchResult.id}>
                    <CardBody>
                      <h5 className="rdb-selectedSearchResultTitle">
                        {searchResult.title}
                      </h5>
                      <div className="rdb-selectedSearchResultButtons">
                        <Button
                          isSecondary
                          isSmall
                          onClick={() => moveSearchResultUp(searchResult.id)}
                        >
                          {__("Move up", "rdb")}
                        </Button>
                        <Button
                          isSecondary
                          isSmall
                          onClick={() => moveSearchResultDown(searchResult.id)}
                        >
                          {__("Move down", "rdb")}
                        </Button>
                        <Button
                          isSecondary
                          isSmall
                          onClick={() => removeSearchResult(searchResult.id)}
                        >
                          {__("Remove", "rdb")}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : null}
      </PanelBody>
    </InspectorControls>
  );

  console.log("searchResults", searchResults);
  console.log("selected searchResults", attributes.searchResults);

  let gridCls = `rdb-grid rdb-grid--layout-${attributes.layout}`;
  const isCol = attributes.layout === "horizontal";
  if (isCol) {
    gridCls += ` rdb-grid--cols${config.noOfGridCols}`;
  }

  return (
    <div className="rdb-wrap">
      <RdbBlockControls
        config={config}
        attributes={attributes}
        setAttributes={setAttributes}
      />
      {inspectorControls}
      {!isDirty && !attributes.searchResults.length && (
        <p>
          {__("Start by searching for posts in the panel to the right", "rdb")}
        </p>
      )}

      {attributes.searchResults &&
        (attributes.layout === "horizontal" ||
          attributes.layout === "vertical") && (
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
      {attributes.layout === "carousel" && (
        <div className={gridCls}>
          {__("Carousel preview not available.", "rdb")}
        </div>
      )}
    </div>
  );
};

export default Edit;
