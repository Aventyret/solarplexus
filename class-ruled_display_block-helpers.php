<?php

class Ruled_display_block_Helpers {
  public static function retrieve_block_configs() {

    $config_path = RDB_PLUGIN_PATH . 'rdb-config.json';

    $theme_config_path = get_stylesheet_directory() . '/rdb-config.json';

    // Override with custom config from theme
    if(file_exists($theme_config_path)) {
      $config_path = $theme_config_path;
    }

    $json = file_get_contents( $config_path );
    $config_data = json_decode( $json, true );

    return $config_data;
  }

  public static function block_args($block_config, $block_type_id, $block_attributes) {
    // Set grid and item classes from attributes
    $allowed_layouts = $block_config['allowedLayouts'];
    $allowed_item_layouts = $block_config['allowedItemLayouts'];

    $classes_grid = [];
    $classes_item = [];
    $attrs_grid = [
      'cols' => [
        'class_base' => 'rdb-grid--cols',
        'value' => $block_config['noOfGridCols'],
        'divider' => ''
      ],
      'layout' => [
        'class_base' => 'rdb-grid--layout',
        'value' => $block_config['allowedLayouts'][0],
        'divider' => '-'
      ]
    ];
    $attrs_item = [
      'cols' => [
        'class_base' => 'rdb-gridItemPostPreview--cols',
        'value' => $block_config['noOfGridCols'],
        'divider' => ''
      ],
      'itemLayout' => [
        'class_base' => 'rdb-gridItemPostPreview--layout',
        'value' => $block_config['allowedItemLayouts'][0],
        'divider' => '-'
      ]
    ];

    foreach ($block_attributes as $key => $attribute) {
      if (array_key_exists($key, $attrs_grid)) {
        $attrs_grid[$key]['value'] = $attribute;
      }

      if (array_key_exists($key, $attrs_item)) {
        $attrs_item[$key]['value'] = $attribute;
      }
    }

    foreach ($attrs_grid as $attribute) {
      $classes_grid[] = sprintf('%s%s%s', $attribute['class_base'], $attribute['divider'], $attribute['value']);
    }

    foreach ($attrs_item as $kery => $attribute) {
      $classes_item[] = sprintf('%s%s%s', $attribute['class_base'], $attribute['divider'], $attribute['value']);
    }

    // Query posts
    $args = [
      'post_status' => 'publish'
    ];

    $current_post_id = get_the_ID();

    if($current_post_id) {
			$args['post__not_in'] = array($current_post_id);
		}

    if (array_key_exists('postType', $block_attributes)) {
      $args['post_type'] = $block_attributes['postType'];
      $args['posts_per_page'] = $block_config['noOfPosts'];
      $args['orderby'] = 'date';
    }

    if(array_key_exists('order', $block_attributes)) {
      $args['order'] = $block_attributes['order'];
    }

    if (array_key_exists('taxonomy', $block_attributes)) {
      $args['tax_query'] = [
        'taxonomy' => $block_attributes['taxonomy']
      ];

      if (array_key_exists('terms', $block_attributes)) {
        $args['tax_query'] = [
          'field' => 'id',
          'terms' => $block_attributes['terms']
        ];
      }
    }

    if (array_key_exists('searchResults', $block_attributes)) {
      $args['post__in'] = wp_list_pluck($block_attributes['searchResults'], 'id');
    }

    $query = new WP_Query($args);

    // Return
    return [
      'posts' => $query->posts,
      'block_attributes' => $block_attributes,
      'classes_grid' => self::block_classes($classes_grid),
      'classes_item' => self::block_classes($classes_item),
    ];
  }

  public static function block_classes($classes) {
    $classes = array_unique($classes);
    $classes = join(' ', $classes);
    $classes = ltrim($classes);

    return $classes;
  }

  public static function template_loader($block, $block_attributes) {
    $loaded_template = '';
    $template = self::get_template($block);

    if ($template && file_exists($template)) {
      $validated_file = validate_file($template);
      if (0 === $validated_file) {
        ob_start();
        load_template($template, false, $block_attributes);
        $loaded_template = ob_get_clean();
      } else {
        error_log("Ruled Display Block: Unable to validate template path: \"$template\". Error Code: $validated_file.");
      }
    } else {
      error_log("Ruled Display Block: Unable to load template for: \"$block\". File not found.");
    }

    return $loaded_template;
  }

  public static function get_template($block) {
    $template = locate_template(
      sprintf(
        '%s/%s.php',
        RDB_TEMPLATE_FOLDER,
        $block
      )
    );

    if (!$template) {
      $template = sprintf(
        '%s%s/%s.php',
        RDB_PLUGIN_PATH,
        RDB_TEMPLATE_FOLDER,
        $block
      );
    }

    return $template;
  }
}