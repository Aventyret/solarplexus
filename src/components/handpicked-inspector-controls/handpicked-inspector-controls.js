import "./handpicked-inspector-controls.scss";

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

import CustomControls from "../custom-controls/custom-controls"


const HandpickedInspectorControls = ({ attributes, setAttributes, config, setIsDirty }) => {

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const search = async () => {
      const res = await fetch(`/wp-json/wp/v2/search/?search=${searchInput}`);
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

  return (
    <InspectorControls>
      <PanelBody>
        <h4>{__("Search", "splx")}</h4>
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
              attributes.searchResults.length >= attributes.noOfPosts;
            return (
              <li className="splx-searchResult" key={searchResult.id}>
                <div>
                  <em>{searchResult.title}</em>
                  <span>{__(searchResult.subtype, "splx")}</span>
                </div>

                <Button
                  isSecondary
                  isSmall
                  disabled={alreadySelected || maxReached}
                  onClick={() => selectSearchResult(searchResult)}
                >
                  {alreadySelected
                    ? __("Already selected", "splx")
                    : maxReached
                    ? sprintf(
                        __("You can't select more than %d posts", "splx"),
                        attributes.noOfPosts
                      )
                    : __("Select", "splx")}
                </Button>
              </li>
            );
          })}
        </ul>
        {attributes.searchResults.length ? (
          <div className="splx-selectedSearchResultsWrap">
            <h4>{__("Selected posts", "splx")}</h4>
            <div className="splx-selectedSearchResults">
              {attributes.searchResults.map((searchResult) => {
                return (
                  <Card key={searchResult.id}>
                    <CardBody>
                      <h5 className="splx-selectedSearchResultTitle">
                        {searchResult.title}
                      </h5>
                      <div className="splx-selectedSearchResultButtons">
                        <Button
                          isSecondary
                          isSmall
                          onClick={() => moveSearchResultUp(searchResult.id)}
                        >
                          {__("Move up", "splx")}
                        </Button>
                        <Button
                          isSecondary
                          isSmall
                          onClick={() => moveSearchResultDown(searchResult.id)}
                        >
                          {__("Move down", "splx")}
                        </Button>
                        <Button
                          isSecondary
                          isSmall
                          onClick={() => removeSearchResult(searchResult.id)}
                        >
                          {__("Remove", "splx")}
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
      <CustomControls
        attributes={attributes}
        setAttributes={setAttributes}
        config={config}
      />
    </InspectorControls>
  );
};

export default HandpickedInspectorControls;
