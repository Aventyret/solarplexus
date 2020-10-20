const { __ } = wp.i18n;

import { useSelect } from "@wordpress/data";

import {
  PanelBody,
  CheckboxControl,
  RadioControl,
  SelectControl,
  RangeControl,
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";

import { isArray } from "lodash";

import { ORDERS } from "../../consts";

const TERMS_DEFAULT_SELECT_VALUE = "";

const DynamicInspectorControls = ({ attributes, setAttributes, config }) => {
  // Get all the registered post types
  const availablePostTypes = useSelect((select) => {
    const { getPostTypes } = select("core");

    const postTypes = getPostTypes();

    // Only return the ones allowed in config
    return postTypes && config.allowedPostTypes
      ? postTypes.filter((postType) => {
          return config.allowedPostTypes.includes(postType.slug);
        })
      : null;
  }, []);

  const availableTaxonomies = useSelect((select) => {
    const { getTaxonomies } = select("core");

    const taxonomies = getTaxonomies();

    return taxonomies && config.allowedTaxonomies
      ? taxonomies.filter((taxonomy) => {
          // Weirdly, taxonomy.slug here refers to the initial key you
          // give register_taxonomy, not the rewrite slug.
          return config.allowedTaxonomies.includes(taxonomy.slug);
        })
      : null;
  });

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

  const selectedTaxonomy = availableTaxsAndTerms
    ? availableTaxsAndTerms.find((taxWTerms) => {
        return taxWTerms.slug === attributes.taxonomy;
      })
    : null;

  const onPostTypeRadioChange = (postTypeSlug) => {
    setAttributes({
      postType: postTypeSlug,
    });
  };

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

  const onOrderSelectChange = (order) => {
    setAttributes({ order });
  };

  const onNoOfPostsChange = (value) => {
    setAttributes({ noOfPosts: value });
  };

  // const onPostTypeCheckboxChange = (postTypeSlug) => {
  //   const newSelectedPostTypes = attributes.postTypes.includes(postTypeSlug)
  //     ? attributes.postTypes.filter((_postTypeSlug) => {
  //         return _postTypeSlug !== postTypeSlug;
  //       })
  //     : [...attributes.postTypes, postTypeSlug];

  //   setAttributes({
  //     postTypes: newSelectedPostTypes,
  //   });
  // };

  return (
    <InspectorControls>
      {availablePostTypes && availablePostTypes.length && (
        <PanelBody title={__("Post types", "splx")}>
          <RadioControl
            label={__("Show posts from:", "splx")}
            selected={attributes.postType}
            options={availablePostTypes.map((postType) => {
              return { label: postType.name, value: postType.slug };
            })}
            onChange={(value) => onPostTypeRadioChange(value)}
          />
          {/* {availablePostTypes.map((postType) => {
          return (
            <CheckboxControl
              key={postType.slug}
              onChange={() => onPostTypeCheckboxChange(postType.slug)}
              label={postType.name}
              checked={attributes.postTypes.includes(postType.slug)}
            />
          );
        })} */}
        </PanelBody>
      )}
      {availableTaxsAndTerms && availableTaxsAndTerms.length && (
        <PanelBody title={__("Taxonomies", "splx")}>
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
      )}
      <PanelBody>
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
    </InspectorControls>
  );
};

export default DynamicInspectorControls;
