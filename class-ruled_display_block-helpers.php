<?php

class Ruled_display_block_Helpers {
  public static function retrieve_block_config() {

    $config_path = RDB_PLUGIN_PATH . 'rdb-config.json';

    $theme_config_path = get_stylesheet_directory() . '/rdb-config.json';

    // Override with custom config from theme
    if(file_exists($theme_config_path)) {
      $config_path = $theme_config_path;
    }

    $json = file_get_contents( $config_path );
    $config_data = json_decode( $json, true );

    // TODO allow override from theme

    return $config_data;
  }

  public static function block_args($block_attributes) {
    $args = [
      'post_status' => 'publish'
    ];

    if (array_key_exists('postType', $block_attributes)) {
      $args['post_type'] = $block_attributes['postType'];
      $args['posts_per_page'] = 3;
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

    return [
      'posts' => $query->posts,
      'block_attributes' => $block_attributes
    ];
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