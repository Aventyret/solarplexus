import "./dynamic-inspector-controls.scss";

const { __ } = wp.i18n;

import { useSelect } from "@wordpress/data";

import {
  PanelBody,
  CheckboxControl,
  RadioControl,
  SelectControl,
  RangeControl,
  Card,
  CardBody,
  Button,
  TextControl
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";

import SearchPostControl from "../common-controls/search-post-control";

import CustomControls from "../custom-controls/custom-controls";

import { isArray } from "lodash";

import { ORDERBYS, ORDERS } from "../../consts";

const TERMS_DEFAULT_SELECT_VALUE = "";

const DynamicInspectorControls = ({ attributes, setAttributes, config, setIsDirty }) => {
  // Get all the registered post types
  const availablePostTypes = useSelect((select) => {
    const { getPostTypes } = select("core");

    const postTypes = getPostTypes( { per_page: -1 } );

    // Only return the ones allowed in config
    return postTypes && config.allowedPostTypes
      ? postTypes.filter((postType) => {
          return config.allowedPostTypes.includes(postType.slug);
        })
      : null;
  }, []);

  const availableTaxonomies = useSelect((select) => {
    const { getTaxonomies } = select("core");

    const taxonomies = getTaxonomies({ per_page: -1 });

    return taxonomies && config.allowedTaxonomies
      ? taxonomies.filter((taxonomy) => {
          // Weirdly, taxonomy.slug here refers to the initial key you
          // give register_taxonomy, not the rewrite slug.
          return config.allowedTaxonomies.includes(taxonomy.slug);
        })
      : null;
  }, []);

  // Get all the terms for specified taxonomies
  const availableTaxsAndTerms = useSelect(
    (select) => {
      if (!availableTaxonomies) return null;

      const { getEntityRecords } = select("core");

      const taxTree = availableTaxonomies.map((tax) => {
        return {
          slug: tax.slug,
          name: tax.name,
          terms: getEntityRecords("taxonomy", tax.slug, { per_page: -1 }),
        };
      });

      return taxTree;
    },
    [availableTaxonomies]
  );

  // Get all available authors
  const availableAuthors = useSelect((select) => {
    const { getAuthors } = select("core");

    const authors = getAuthors();

    return authors;
  }, []);

  const selectedTaxonomy = availableTaxsAndTerms
    ? availableTaxsAndTerms.find((taxWTerms) => {
        return taxWTerms.slug === attributes.taxonomy;
      })
    : null;

  const onTaxonomyRadioChange = (taxonomySlug) => {
    // Clear the terms of previous selection when taxonomy changes
    setAttributes({ terms: [], taxonomy: taxonomySlug });
  };

  const onTermCheckboxChange = (termId) => {
    const newSelectedTerms = attributes.terms.includes(termId)
      ? attributes.terms.filter((_termId) => {
          return _termId !== termId;
        })
      : [...attributes.terms, termId];

    setAttributes({
      terms: newSelectedTerms,
    });
  };

  const onOrderbySelectChange = (orderby) => {
    setAttributes({ orderby });
  };

  const onOrderbyMetaKeyChange = (value) => {
    setAttributes({ orderbyMetaKey: value });
  };

  const onOrderSelectChange = (order) => {
    setAttributes({ order });
  };

  const onHasPaginationCheckboxChange = () => {
    setAttributes({ hasPagination: !attributes.hasPagination });
  };

  const onNoOfPostsChange = (value) => {
    setAttributes({ noOfPosts: value });
  };

  const onAuthorsCheckboxChange = (value) => {
    if (!value) {
      setAttributes({ authors: [] });
      return;
    }

    const intValue = parseInt(value, 10);
    if (attributes.authors.includes(intValue)) {
      setAttributes({
        authors: attributes.authors.filter((authorId) => {
          return authorId !== intValue;
        }),
      });
    } else {
      setAttributes({ authors: [...attributes.authors, intValue] });
    }
  };

  const onPostTypeCheckboxChange = (postTypeSlug) => {
    const selectedPostTypes = attributes.postType.split(',');
    const postTypeWasSelected = selectedPostTypes.includes(postTypeSlug);
    const newSelectedPostTypes = postTypeWasSelected ? selectedPostTypes.filter((_postTypeSlug) => _postTypeSlug !== postTypeSlug) : [...selectedPostTypes, postTypeSlug];

    setAttributes({
      postType: newSelectedPostTypes.join(','),
    });
  };

  const selectSearchResult = (searchResult) => {
    setAttributes({
      handpickedPosts: [...attributes.handpickedPosts, {position: 1, post: searchResult}],
    });
  };

  const existingPosts = attributes.handpickedPosts.map(existing => existing.post)

  const removeHandpickedPost = (existingPostId) => {
    setAttributes({
      handpickedPosts: attributes.handpickedPosts.filter((existing) => {
        return existing.post.id !== existingPostId;
      }),
    });
  };

  const positionOptions = [];
  for(let i = 0; i < attributes.noOfPosts; i++) {
    positionOptions.push({label: i + 1, value: i + 1});
  }

  const setPosition = (existingPostId, position) => {
    const existingIndex = attributes.handpickedPosts.findIndex((existing) => existing.post.id === existingPostId);
    setAttributes({
      handpickedPosts: [
        ...attributes.handpickedPosts.slice(0, existingIndex),
        {
          ...attributes.handpickedPosts[existingIndex],
          position
        },
        ...attributes.handpickedPosts.slice(existingIndex + 1)
      ]
    });
  }

  return (
    <InspectorControls>
      {availablePostTypes && availablePostTypes.length && (
        <PanelBody className="splx-panel" title={__("Post types", "splx")}>
          { availablePostTypes.map((postType) => {
            return (
              <CheckboxControl
                key={postType.slug}
                onChange={() => onPostTypeCheckboxChange(postType.slug)}
                label={postType.name}
                checked={attributes.postType.split(',').includes(postType.slug)}
              />
            );
          })}
        </PanelBody>
      )}
      {availableTaxsAndTerms && availableTaxsAndTerms.length ? (
        <PanelBody className="splx-panel" title={__("Taxonomies", "splx")}>
          <RadioControl
            label={__("Show posts from:", "splx")}
            selected={attributes.taxonomy}
            options={[
              { label: __("All", "splx"), value: TERMS_DEFAULT_SELECT_VALUE },
              ...availableTaxsAndTerms.map((taxWTerms) => {
                return { label: taxWTerms.name, value: taxWTerms.slug };
              }),
            ]}
            onChange={(value) => onTaxonomyRadioChange(value)}
          />
          {selectedTaxonomy &&
            selectedTaxonomy.terms &&
            selectedTaxonomy.terms.map((term) => {
              // TODO force user to select at least 1 term somehow?
              return (
                <CheckboxControl
                  key={term.id}
                  checked={attributes.terms.includes(term.id)}
                  label={term.name}
                  onChange={() => onTermCheckboxChange(term.id)}
                />
              );
            })}
        </PanelBody>
      ) : null}
      {availableAuthors && availableAuthors.length && (
        <PanelBody className="splx-panel" title={__("Authors", "splx")}>
          <CheckboxControl
            checked={!attributes.authors.length}
            label={__("All authors", "splx")}
            onChange={() => onAuthorsCheckboxChange(null)}
          />
          {availableAuthors.map(({ id, name }) => {
            return (
              <CheckboxControl
                key={id}
                checked={attributes.authors.includes(id)}
                label={name}
                onChange={() => onAuthorsCheckboxChange(id)}
              />
            );
          })}
        </PanelBody>
      )}
      <PanelBody className="splx-panel" title={__("Sort order", "splx")}>
        <SelectControl
          label={__("Order by", "splx")}
          value={attributes.orderby}
          onChange={(orderby) => onOrderbySelectChange(orderby)}
          options={Object.keys(ORDERBYS).map((key) => {
            return {
              value: key,
              label: ORDERBYS[key],
            };
          })}
        />
        {['meta_value', 'meta_value_num'].includes(attributes.orderby) ? (
          <TextControl
            label={__("Meta field name", "splx")}
            value={attributes.orderby_meta_key}
            onChange={onOrderbyMetaKeyChange}
          />
        ) : null}
        <SelectControl
          label={__("Order", "splx")}
          value={attributes.order}
          onChange={(order) => onOrderSelectChange(order)}
          options={Object.keys(ORDERS).map((key) => {
            return {
              value: key,
              label: ORDERS[key],
            };
          })}
        />
      </PanelBody>
      {config.allowPagination ? (
        <PanelBody>
          <CheckboxControl
            checked={attributes.hasPagination}
            label={__("Has pagination", "splx")}
            onChange={onHasPaginationCheckboxChange}
          />
        </PanelBody>
      ) : null}
      {isArray(config.noOfPosts) ? (
        <PanelBody title={__("Number of items")}>
          <RangeControl
            value={attributes.noOfPosts}
            min={config.noOfPosts[0]}
            max={config.noOfPosts[1]}
            onChange={(value) => onNoOfPostsChange(value)}
          />
        </PanelBody>
      ) : null}
      {config.allowHandpicked ? (
        <PanelBody className="splx-panel" title={__("Handpicked posts", "splx")}>
          <SearchPostControl attributes={attributes} config={config} setIsDirty={setIsDirty} selectSearchResult={selectSearchResult} existingPosts={existingPosts}/>
          {attributes.handpickedPosts.length ? (
            <div className="splx-handpickedPostsWrap">
              <h4>{__("Selected posts", "splx")}</h4>
              <div className="splx-handpickedPosts">
                {attributes.handpickedPosts.map((handpicked) => {
                  return (
                    <Card key={handpicked.post.id}>
                      <CardBody>
                        <h5 className="splx-handpickedPostTitle">
                          {handpicked.post.title}
                        </h5>
                        <div className="splx-handpickedPostButtons">
                          <Button
                            isSecondary
                            isSmall
                            onClick={() => removeHandpickedPost(handpicked.post.id)}
                          >
                            {__("Remove", "splx")}
                          </Button>
                          <SelectControl
                            value={handpicked.position}
                            options={positionOptions}
                            onChange={(position) => setPosition(handpicked.post.id, position)} />
                        </div>

                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : null }
        </PanelBody>
      ) : null}
      <CustomControls
        attributes={attributes}
        setAttributes={setAttributes}
        config={config}
      />
    </InspectorControls>
  );
};

export default DynamicInspectorControls;
