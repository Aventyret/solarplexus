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
    "noOfGridCols": 2,
    "itemLayout": "imagebg",
    "showDate": true,
    "showExcerpt": true,
    "customControls": []
  }
]

```

You can create as many block types as you need by adding objects to the array. All options are *required*, if nothing else is stated in the reference below.

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

### allowedTaxonomies
_[string]_ - `dynamic` type only. The key(s) of the taxonomies the editor will be able to filter on when using the block. For custom taxonomies, you must have `show_in_rest` set to `true` when calling `register_taxonomy` in your theme/plugin.

### noOfPosts
_int|[int]_ - The maximum posts to be shown in the resulting lists. For `dynamic`, an array can be used instead, with 2 positions declaring the min and max number, e.g [3, 6], letting the editor choose from a range between these.

### allowedTaxonomies
_[string]_ - `dynamic` type only. The key(s) of the taxonomies the editor will be able to filter on when using the block. For custom taxonomies, you must have `show_in_rest` set to `true` when calling `register_taxonomy` in your theme/plugin.

### allowDuplicates - optional
_boolean_ - `dynamic` type only. Sets if Solarplexus check for not showing duplicate posts on the same page should be disabled. Defaults to `false`.

### allowPagination - optional
_boolean_ - `dynamic` type only. Sets if editors should be allowed to enable pagination for blocks of this type. Defaults to `false`.

### allowHandpicked - optional
_boolean_ - `dynamic` type only. Sets if editors should be allowed to add handpicked posts to dynamic blocks. Defaults to `false`.

### icon - optional
_string_ - The icon for the block type, defaults to the Solarplexus logo. Can be an inline SVG html string. Double quotes can be escaped.

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

## Configuration attributes for default templates
The following attributes are only required (and meaningful) when you use Solarplexus' default templates.

### noOfGridCols
_int_ - The number of columns (when screen with allows) the post grid will consist of.

### itemLayout
_string_ - Can be either `imagebg`, `imagetop` or `imageleft`. Controls the layout within each post item in the list.

### showDate
_bool_ - Whether to show the post dates in the rendered lists.

### showExcerpt
_bool_ - Whether to show the post excerpts in the rendered lists.
