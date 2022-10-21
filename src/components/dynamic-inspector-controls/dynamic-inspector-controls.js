import "./dynamic-inspector-controls.scss";

const { __ } = wp.i18n;

import { useSelect } from "@wordpress/data";

import {
  PanelBody,
  CheckboxControl,
  SelectControl,
  RangeControl,
  Card,
  CardBody,
  Button,
  TextControl,
  FormTokenField
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
  const availableTaxonomiesWithTerms = useSelect(
    (select) => {
      if (!availableTaxonomies) return null;

      const { getEntityRecords } = select("core");

      const taxTree = availableTaxonomies.map((tax) => {
        const terms = getEntityRecords("taxonomy", tax.slug, { per_page: -1, hide_empty: true })?.map(term => ({
          ...term,
          name: term.name.replace(/&amp;/g, '&')
        })) || null;

        let selectedTermIds = attributes.taxonomyTerms.find(taxonomyTerm => taxonomyTerm.slug === tax.slug)?.terms || [];

        // Handle legacy attributes from before multiple taxonomy support
        if (attributes.taxonomy && terms) {
          selectedTermIds = attributes.terms.filter(selectedTermId => terms.find(term => term.id === selectedTermId));
        }
        const value = terms?.length ? selectedTermIds.map(termId => {
          const term = terms.find(t => t.id === termId);
          return term.name;
        }) : [];

        return {
          slug: tax.slug,
          name: tax.name,
          terms,
          suggestions: terms?.map(term => term.name) || [],
          value
        };
      });

      return taxTree;
    },
    [availableTaxonomies, attributes]
  );

  // Get all available authors
  const availableAuthors = useSelect((select) => {
    const { getUsers } = select("core");

    const authors = getUsers({ who: "authors", per_page: -1 });

    return authors;
  }, []);

  const onTermsChange = (taxonomySlug, termNames) => {
    const taxonomyWithTerms = availableTaxonomiesWithTerms.find(taxonomyWithTerm => taxonomyWithTerm.slug === taxonomySlug);
    const termIds = taxonomyWithTerms.terms.filter(term => termNames.includes(term.name)).map(term => term.id);

    let taxonomyTerms = attributes.taxonomyTerms.filter(taxonomyTerm => taxonomyTerm.slug !== taxonomyWithTerms.slug);
    taxonomyTerms = [
      ...taxonomyTerms,
      {
        slug: taxonomySlug,
        terms: termIds
      }
    ];

    // Set taxonomyTerms attribute and unset legacy taxonomy and terms attributes
    setAttributes({
      taxonomyTerms,
      taxonomy: '',
      terms: []
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

  const authorsSuggestions = availableAuthors?.map(author => author.name)
  const authorsValue = availableAuthors ? attributes.authors?.map(authorId => {
    const author = availableAuthors?.find(author => author.id === authorId);
    if (author) {
      return author.name;
    }
    return '';
  }) || [] : [];

  const onAuthorsChange = (authorNames) => {
    const authorIds = availableAuthors.filter(author => authorNames.includes(author.name)).map(author => author.id);
    setAttributes({ authors: authorIds });
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
      {availablePostTypes?.length ? (
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
      ) : null}
      {availableTaxonomiesWithTerms?.length || availableAuthors?.length ? (
        <PanelBody className="splx-panel splx-panel--no-scroll" title={__("Filter", "splx")}>
          {availableTaxonomiesWithTerms.map(taxonomyWithTerms => {
            return (
              <FormTokenField
                key={taxonomyWithTerms.slug}
                label={ taxonomyWithTerms.name }
                value={ taxonomyWithTerms.value }
                suggestions={ taxonomyWithTerms.suggestions }
                onChange={ ( taxonomyTermNames ) => onTermsChange(taxonomyWithTerms.slug, taxonomyTermNames) }
                __experimentalShowHowTo={ false }
                __experimentalExpandOnFocus={ true }
              />
            );
          })}
          {availableAuthors?.length ? (
            <FormTokenField
              label={ __("Authors", "splx") }
              value={ authorsValue }
              suggestions={ authorsSuggestions }
              onChange={ onAuthorsChange }
              __experimentalShowHowTo={ false }
              __experimentalExpandOnFocus={ true }
            />
          ) : null }
        </PanelBody>
      ) : null}
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
