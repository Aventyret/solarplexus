# Templating

Even when you are creating a custom config with your own block types, creating custom templates for those blocks are not necessarily required. Solarplexus will use its default templates to render your custom blocks, that you can slap some custom CSS on anywhere in your theme to make everything look they way you want.

However, it's a good idea to create your own templates if:
- You'd like to define your own HTML markup and CSS classes for the block rendering
- You'd like to create more advanced layouts such as carousels
- You'd like to display something else than the basic content elements of post, such as custom fields. Read more in the "Advanced customization" section on how to pass such data to a template.

Creating your own templates is easy. If your theme is based on **Roots Sage**:
1. Create a folder called `splx-templates` in the `resources/views` folder in the theme.
2. In `splx-templates`, create your Blade template file, matching the block type id from your config, e.g `my-example-dynamic.blade.php`

If you are not using Sage and just a **standard setup**:
1. Create a folder called `splx-templates` in the theme root.
2. In `splx-templates`, create your php template file, matching the block type id from your config, e.g `my-example-dynamic.php`

Solarplexus will now detect your custom template and will use that instead of the default template.

## Accessing data passed to the template
When using Sage, the following variables will we accessible directly. When not using Sage, you'll find them all as keys within the `$args` variable.

### posts
_array_ - The list of post results queried by the block.
**Note:** To use WP functions like `the_title()` you must first setup the `$post` object:
```php
global $post

foreach ( $posts as $post_item ) {
  $post = $post_item;
  setup_postdata( $post );

  // Item content
}
wp_reset_postdata();
```

### classes_grid
_string_ - The classnames that you should apply to the HTML element wrapping the different posts (grid items).

### classes_item
_string_ - The classnames that you should apply to **each** post/grid item.

**Note:** See the "Advanced customization" section on how to define your own classnames.

### block_attributes
_array_ - The raw attributes saved to the database for the block instance. If you have added `customControls` to your config, the values of those will be included here.

### config
_array_ - The Solarplexus config for the block type of the block instance

### query
_string_ - The query string that was passed to the $wp_query object by WP class.

## Pagination
If the Has Pagination option (available in the admin interface of blocks with type `dymanic`) Solarplexus can add a Wordpress style pagination to your blocks (using [paginate_links](https://developer.wordpress.org/reference/functions/paginate_links/)).

If you use the default templates the pagination will be rendered automatically, but if you create custom templates you will need to add the pagination to your block templates.

Example when using Sage:

```php
<div class="my-block">
  <div class="my-block-posts">
  </div>
  @if($block_attributes['hasPagination'])
  <div class="my-block-pagination">
    @php Solarplexus_Helpers::the_block_pagination($block_attributes, $pagination) @endphp
  </div>
  @endif
</div>
```

Example when not using Sage:

```php
<div class="my-block">
  <div class="my-block-posts">
  </div>
  <?php if($args['block_attributes']['hasPagination']): ?>
  <div class="my-block-pagination">
    <?php Solarplexus_Helpers::the_block_pagination($args) ?>
  </div>
  <?php endif; ?>
</div>
```

In many cases you would display your pagination as a "show more" button for screen users. For now will need to implement that behaviour in your theme.

## Using your custom template in the editor
As soon as you create your own template(s) in your theme matching your configured block IDs, those templates will be used for preview within the Gutenberg editor as well. Easy!

## Caveats to keep in mind for Sage themes
When a Sage theme is detected, Solarplexus assumes that Blade rendering is available according to standard configuration. This means that if you've made changes to how Blade is initiated in Sage's `setup.php` file, everything may not work properly. It does however not rely on that the Sage default `App` namespace is present.

