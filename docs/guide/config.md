# Configuration

To define your own blocks instead of the two default ones, the first thing you need to do is to create a config file in your theme.

In the root of your theme, create the file `splx-config.json`. If you are using **Roots Sage**, create the file in the `resources` folder. **When a custom config is created in your theme, the two default blocks will not be available anymore**.

Here's an example config, which defines two blocks similar to the blocks that the plugin ships with by default (that are described on the previous page):

```
[
  {
    "id": "my-example-dynamic",
    "title": "My dynamic posts or pages example",
    "type": "dynamic",
    "allowedPostTypes": ["post", "page"],
    "allowedTaxonomies": ["category"],
    "noOfPosts": [2,8],
    "noOfGridCols": 2,
    "itemLayout": "imagebg",
    "showDate": true,
    "showExcerpt": true,
    "customControls": []
  },
  {
    "id": "my-example-handpicked",
    "title": "My hand picked posts or pages example",
    "type": "handpicked",
    "allowedPostTypes": ["post", "page"],
    "noOfPosts": 8,
    "prependNewPosts": true,
    "noOfGridCols": 2,
    "itemLayout": "imagebg",
    "showDate": true,
    "showExcerpt": true,
    "customControls": [],
    "postCustomControls": []
  }
]

```

You can create as many block types as you need by adding objects to the array. All options are _required_, if nothing else is stated in the reference below.

## Configuration reference

### id

_string_ - A unique ID without spaces to identify your block type in the database.

### title

_string_ - The title of the block type.

### type

_string_ - There are two types of block types - `dynamic` and `handpicked`. Dynamic loads the latest posts based on the configuration combined with the editors choices, while Hand picked always shows the same posts that the editor specifically has picked.

### allowedPostTypes

_[string]_ - The post type(s) the editor will be able to choose from when using the block. For custom post types, you must have `show_in_rest` set to `true` when calling `register_post_type` in your theme/plugin.

If you omit `allowedPostTypes` dynamic blocks will show `posts` and handpicked blocks will be able to show any post type.

### noOfPosts

_int|[int]_ - The maximum posts to be shown in the resulting lists. An array can be used, with 2 positions declaring the min and max number, e.g [3, 6], letting the editor choose from a range between these.

### prependNewPosts

_boolean_ - `handpicked` type only. If true posts are added to the start of the list, otherwise they are appended at the end. Defaults to `false`.

### allowedTaxonomies

_[string]_ - `dynamic` type only. The key(s) of the taxonomies the editor will be able to filter on when using the block. For custom taxonomies, you must have `show_in_rest` set to `true` when calling `register_taxonomy` in your theme/plugin.

### allowedPostStatuses - optional

_[string]_ - `handpicked` type only. Defaults to ["publish"]. Posts with any other status than "publish" will only be visible in the editor.

### randomize - optional

_boolean_ - `handpicked` type only. If true the order of the posts will be shuffled. If more posts are selected than the max `noOfPosts` the posts array will (as always) also be capped to `noOfPosts`. Defaults to `false`.

### allowRandomize - optional

_boolean_ - `handpicked` type only. If true the block will have a checkbox to control if posts are randomized (see `randomize`). Defaults to `false`.

### allowDuplicates - optional

_boolean_ - `dynamic` type only. Sets if Solarplexus check for not showing duplicate posts on the same page should be disabled. Defaults to `false`.

### allowPagination - optional

_boolean_ - `dynamic` type only. Sets if editors should be allowed to enable pagination for blocks of this type. Defaults to `false`.

### allowOffset - optional

_boolean_ - `dynamic` type only. Sets if editors should be allowed to enable offset for blocks of this type. Defaults to `false`.

### allowHandpicked - optional

_boolean_ - `dynamic` type only. Sets if editors should be allowed to add handpicked posts to dynamic blocks. Defaults to `false`.

### allowHandpicked - optional

_boolean_ - `dynamic` type only. Sets if editors should be allowed to add handpicked posts to dynamic blocks. Defaults to `false`.

### handpickedPostTypes - optional

_[string]_ - Specifies of what post types posts can be handpicked from. If omitted `allowedPostTypes` will be used.

### icon - optional

_string_ - The icon for the block type, defaults to the Solarplexus logo. Use one of the following default logos or an inline SVG html string. Double quotes can be escaped.

| Name       | Icon                                |
| ---------- | ----------------------------------- |
| default    | ![Default](/solarplexus.svg)        |
| article    | ![Article](/article.svg)            |
| articles   | ![Multiple articles](/articles.svg) |
| masonry    | ![Masonry](/masonry.svg)            |
| 1-col      | ![1-col](/1-col.svg)                |
| 2-col      | ![2-col](/2-col.svg)                |
| 3-col      | ![3-col](/3-col.svg)                |
| 4-col      | ![4-col](/4-col.svg)                |
| 2-col-grid | ![2-col grid](/2-grid.svg)          |
| 3-col-grid | ![3-col grid](/3-grid.svg)          |
| 4-col-grid | ![4-col grid](/4-grid.svg)          |

### customControls - optional

_array_ - Here you may define additional controls for the editor, that will be included as attributes on the block. Currently, selectboxes and text inputs are supported. Say for instance that you'd like to add a selection of colors to add styles to in the templates:

```
"customControls": [
      {
        "id": "color",
        "type": "select",
        "name": "Color",
        "choices": [
          {
            "value": "red",
            "label": "Red"
          },
          {
            "value": "blue",
            "label": "Blue"
          }
        ]
      }
    ]
```

Or, add a heading to the post list:

```
"customControls": [
      {
        "id": "heading",
        "type": "text",
        "name": "Heading"
      }
    ]
```

For longer texts, you can use the textarea type:

```
"customControls": [
      {
        "id": "preamble",
        "type": "textarea",
        "name": "Preamble"
      }
    ]
```

The id (as long as it doesn't collide with an already-exisiting attribute), name and choices can be anything you'd like. See more on the next page on how to work with templates.

### postCustomControls - optional

_array_ - `handpicked` type only. Here you may define additional controls for each selected post in the editor, that will be included in the Post object. Currently, selectboxes and text inputs are supported. Say for instance that you'd like to add a custom title instead of using post_title:

```
"postCustomControls": [
      {
        "id": "custom_post_title",
        "type": "text",
        "name": "Set a custom post title"
      }
    ]
```

The postCustomControls are saved in the Post object, example:

```
WP_Post Object =>
(
  [ID] => 38
  ...
  [post_custom_controls] => Array
  (
      [custom_post_title] => Custom post title
  )
)
```

## Configuration attributes for default templates

The following attributes are only required (and meaningful) when you use Solarplexus' default templates.

### noOfGridCols

_int_ - The number of columns (when screen width allows) the post grid will consist of.

### itemLayout

_string_ - Can be either `imagebg`, `imagetop` or `imageleft`. Controls the layout within each post item in the list.

### showDate

_bool_ - Whether to show the post dates in the rendered lists.

### showExcerpt

_bool_ - Whether to show the post excerpts in the rendered lists.

## Adjust configuration with php filter

Configuration in a json file can be conveniant, but in some cases you need more flexibility.

Perhaps to add translations to block names or custom controls, or to make the configuration conditional – for instance if you want different blocks in different network sites with the same theme.

In these cases you can use the filter `splx_config` to make dynamic adjustments to the configuration. This is an example of how you could add translations to your block titles:

```
add_filter('splx_config', function($splx_config) {
  return array_map(function($block_config) {
    return array_merge(
      $block_config,
      [
        'title' => __($block_config['title'], 'your_text_domain'),
      ],
    );
  }, $splx_config);
});
```
