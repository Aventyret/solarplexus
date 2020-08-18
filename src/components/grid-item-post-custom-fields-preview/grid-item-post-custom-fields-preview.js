import "./grid-item-post-custom-fields-preview.scss";

import { isArray, isEmpty } from "lodash";

const GridItemPostCustomFieldsPreview = ({ post, config }) => {
  if (!isArray(config.customFields)) return null;
  const { customFields } = config;
  if (isEmpty(customFields)) return null;

  return (
    <div className="rdb-gridItemPostCustomFieldsPreview">
      {customFields.map((customField, i) => {
        if (!post[customField.name]) return null;
        const baseCls = "rdb-gridItemPostCustomFieldsPreview__field";
        const typeCls = `${baseCls}--${customField.type}`;
        // TODO more types
        if (customField.type === "string") {
          return (
            <div
              key={i}
              className={`${baseCls} ${typeCls} ${baseCls}--${customField.name}`}
            >
              {post[customField.name]}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default GridItemPostCustomFieldsPreview;
