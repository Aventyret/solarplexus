const { __ } = wp.i18n;

import _ from "lodash";

import {
  PanelBody,
  CheckboxControl,
  RadioControl,
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";

import { useSelect } from "@wordpress/data";

import GridItemPostPreview from "../../components/grid-item-post-preview/grid-item-post-preview";
import RdbBlockControls from "../../components/rdb-block-controls/rdb-block-controls";

const TERMS_DEFAULT_SELECT_VALUE = "";

const DynamicDisplayBlockEdit = ({ config, attributes, setAttributes }) => {
  const currentPostId = useSelect((select) => {
    const { getCurrentPostId } = select("core/editor");

    const postId = getCurrentPostId();

    return postId;
  }, []);

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

  const posts = useSelect(
    (select) => {
      const { getEntityRecords } = select("core");

      let q = {
        status: "publish",
        per_page: config.noOfPosts,
        exclude: currentPostId,
      };

      if (attributes.taxonomy && attributes.terms) {
        q[attributes.taxonomy] = attributes.terms;
      }

      const perType = getEntityRecords("postType", attributes.postType, q);

      return perType;
    },
    [attributes.postType, attributes.taxonomy, attributes.terms, currentPostId]
  );

  console.log("posts", posts);

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

  const onPostTypeRadioChange = (postTypeSlug) => {
    setAttributes({
      postType: postTypeSlug,
    });
  };

  const onTaxonomyRadioChange = (taxonomySlug) => {
    // Clear the terms of previous selection when taxonomy changes
    setAttributes({ terms: [], taxonomy: taxonomySlug });
  };

  if (!config.allowedPostTypes)
    return <span>Error: allowedPostTypes not configured</span>;

  const inspectorControls = (
    <InspectorControls>
      {availablePostTypes && availablePostTypes.length && (
        <PanelBody title={__("Post types", "rdb")}>
          <RadioControl
            label={__("Show posts from:", "rdb")}
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
        <PanelBody title={__("Taxonomies", "rdb")}>
          <RadioControl
            label={__("Show posts from:", "rdb")}
            selected={attributes.taxonomy}
            options={[
              { label: __("All", "rdb"), value: TERMS_DEFAULT_SELECT_VALUE },
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
    </InspectorControls>
  );

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
      {posts &&
        (attributes.layout === "horizontal" ||
          attributes.layout === "vertical") && (
          <div className={gridCls}>
            {posts.map((post) => (
              <GridItemPostPreview
                key={post.id}
                post={post}
                config={config}
                layout={attributes.itemLayout}
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

export default DynamicDisplayBlockEdit;
