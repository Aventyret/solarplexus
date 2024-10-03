# Advanced Customization

## Defining your own CSS classes

You can redefine the classnames for the grid and grid items to whatever you want. Simply use the custom hooks:

```
add_filter('splx_grid_classes', function($classes, $block_config, $block_attributes){
  // Use the default $classes, the $block_config and $block_attributes to
  // specify your own grid classes.
  return $classes;
}, 10, 3);

add_filter('splx_item_classes', function($classes, $block_config, $block_attributes){
  // Use the default $classes, the $block_config and $block_attributes to
  // specify your own item classes.
  return $classes;
}, 10, 3);
```

## Adding custom fields or other data

Often times, you're going to want to display some custom data in your items. Instead of querying for that data directly in the template, use the provided custom hook, which is applied on the posts after a successful query:

```
add_filter('splx_posts', function($posts, $block_config, $block_attributes, $pagination){
  $upd_posts = [];
  foreach($posts as $p) {
    $upd_post = clone $p;
    $upd_post->my_custom_field = get_post_meta($p->ID, 'my_custom_field', true);
    $upd_posts[] = $upd_post;
  }
  return $upd_posts;
}, 10, 4);
```

The `posts` array available in your template will now include the above additions.

## Modifying the query

If you'd like greater control of what posts are actually queried from the database, you may change the arguments before they are passed to `WP_Query`. Example:

```
add_filter('splx_queryargs', function($args, $block_config, $block_attributes){
  $super_important_post_id = 1337;
  $args['post__in'][] = $super_important_post_id; // always include a certain post no matter what.
  return $args;
}, 10, 3);
```

## Adjust block args

For advanced customization, there is a possibility to adjust the variables that are passed to Solarplexus block templates with a filter

```
add_filter('splx_block_args', function($args, $block_type_id){
  $args = array_merge($args, ["interesting_fact" => "You are awesome!"]); // This will pass the variable $args["interesting_fact"] (or just $interesing_fact if you use Sage) to all Solarplexus block templates.
  return $args;
}, 10, 2);
```

## Render blocks with a callback

In some cases, such as with a Headless Wordpress setup, it can be usefull to render blocks with a callback rather than a template.

```
add_filter('splx_block_render_callback', function($template, $args, $block_type_id){
  if ($block_type_id == "splx/special-block") {
    return '<p>This was rendered with a callback.</p>';
  }
  $args = array_merge($args, ["interesting_fact" => "You are awesome!"]); // This will pass the variable $args["interesting_fact"] (or just $interesing_fact if you use Sage) to all Solarplexus block templates.
  return $template;
}, 10, 3);
```

## Enable default block styling

By default the block styling by the plugin is disabled if you've added your own splx-config.json in your theme. If you'd like to enable it, you can do so by adding the following to your theme's `functions.php` file:

```
add_filter('splx_enable_default_style', function() {
	return true;
});
```
