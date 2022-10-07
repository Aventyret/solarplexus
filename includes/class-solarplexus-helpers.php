<?php
/**
 * Helper functions for the plugin, all called statically.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/includes
 */
class Solarplexus_Helpers {
  // Used to keep track of rendered posts to avoid duplicates
  private static $rendered_post_ids = [];

  public static function retrieve_block_configs() {
    // Allow config via PHP
    $config_data = apply_filters( 'splx_config', [] );

    if ( empty( $config_data ) ) {
      $config_path = SPLX_PLUGIN_PATH . 'splx-config.json';
    }

    $theme_config_path = get_stylesheet_directory() . '/splx-config.json';

    // Override with custom config from theme
    if(file_exists($theme_config_path)) {
      $config_path = $theme_config_path;
    }

    if ( ! empty( $config_path ) ) {
      $json = file_get_contents( $config_path );
      $config_data = array_merge( json_decode( $json, true ), $config_data );
    }

    return $config_data;
  }

  public static function get_block_type_id($block_config) {
    $id = null;
    if(array_key_exists('id', $block_config)) {
      $id = $block_config['id'];
    }
    return $id;
  }

  public static function block_args($block_config, $block_attributes) {
    $block_type_id = self::get_block_type_id($block_config);
    $attrs_grid = [];
    $attrs_item = [];
    $classes_grid = [];
    $classes_item = [];

    foreach ($block_attributes as $key => $attribute) {
      if (array_key_exists($key, $attrs_grid)) {
        $attrs_grid[$key]['value'] = $attribute;
      }

      if (array_key_exists($key, $attrs_item)) {
        $attrs_item[$key]['value'] = $attribute;
      }
    }

    if ( isset( $block_config['noOfGridCols'] ) ) {
      // Set grid and item classes from attributes
      $attrs_grid['cols'] = [
        'class_base' => 'splx-grid--cols',
        'value' => $block_config['noOfGridCols'],
        'divider' => ''
      ];
      $attrs_item['cols'] = [
        'class_base' => 'splx-gridItemPost--cols',
        'value' => $block_config['noOfGridCols'],
        'divider' => ''
      ];
    }

    // Add itemLayout
    // directly from config instead
    // of from block attributes.
    if ( isset( $attrs_grid['itemLayout'] ) ) {
      $attrs_item['itemLayout'] = [
        'class_base' => 'splx-gridItemPost--layout',
        'value' => $block_config['itemLayout'],
        'divider' => '-'
      ];
    }

    foreach ($attrs_grid as $attribute) {
      $classes_grid[] = sprintf('%s%s%s', $attribute['class_base'], $attribute['divider'], $attribute['value']);
    }

    foreach ($attrs_item as $key => $attribute) {
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
      $args['post_type'] = explode(',', $block_attributes['postType']);
      $args['posts_per_page'] = $block_attributes['noOfPosts'];
      $args['orderby'] = 'date';
    } else {
      $args['post_type'] = 'any';
    }

    if (array_key_exists('order', $block_attributes)) {
      $args['order'] = $block_attributes['order'];
    }

    if (array_key_exists('taxonomy', $block_attributes) && array_key_exists('terms', $block_attributes) && !empty($block_attributes['terms'])) {
      $args['tax_query'] = [];
      $args['tax_query'][] = [
        'taxonomy' => $block_attributes['taxonomy'],
        'field' => 'term_id',
        'terms' => $block_attributes['terms']
      ];
    }

    /**
    * @since    1.2.0
    */
    if(array_key_exists('authors', $block_attributes) && !empty($block_attributes['authors'])) {
      $args['author__in'] = $block_attributes['authors'];
    }

    if (array_key_exists('searchResults', $block_attributes)) {
      $args['post__in'] = wp_list_pluck($block_attributes['searchResults'], 'id');
      if(empty($args['post__in'])) {
        $args['post__in'][] = 0;
      }
      if(!array_key_exists('orderby', $args)) {
        $args['orderby'] = 'post__in';
      }
    }

    $allow_duplicates = $block_config['allowDuplicates'] ?? false;
    $handpicked = ( $block_config['type'] ?? '' ) === 'handpicked';
    if ( ! $allow_duplicates && ! $handpicked ) {
      // Exclude previously rendered posts from the query args
      $args = self::exclude_rendered_posts_in_args( $args );
    }

    $allow_pagination = $block_config['allowPagination'] ?? false;
    $has_pagination = $allow_pagination && isset($block_attributes['hasPagination']) && $block_attributes['hasPagination'];
    if ($has_pagination && isset($block_attributes['noOfPosts']) && $block_attributes['noOfPosts'] > -1) {
      $args['offset'] = (self::block_page($block_attributes) - 1) * $block_attributes['noOfPosts'];
    }

    /**
     * Filter the query args returning to the block render.
     *
     * @since 1.2.0
     *
     * @param array $args             Query args.
     * @param array $block_config     Block config
     * @param array $block_attributes Block attributes
     */
    $args = apply_filters('splx_queryargs', $args, $block_config, $block_attributes);

    $query = new WP_Query( $args );

    // Keep track of rendered posts to avoid rendering same post multiple times on a page
    self::keep_track_of_rendered_posts( $query->posts );

    // Is this block paginated?
    $pagination = false;
    if ($has_pagination) {
      $pagination = array(
        'page' => self::block_page($block_attributes),
        'max_num_pages' => $query->max_num_pages,
      );
    }

    /**
     * Filter the posts array before returning to the block render.
     *
     * @since 1.2.0
     *
     * @param array $posts            Posts array.
     * @param array $block_config     Block config
     * @param array $block_attributes Block attributes
     */
    $posts = apply_filters( 'splx_posts', $query->posts, $block_config, $block_attributes, $pagination );

    return [
      'query' => $query->query,
      'posts' => $posts,
      'pagination' => $pagination,
      'block_attributes' => $block_attributes,
      'classes_grid' => apply_filters( 'splx_grid_classes', self::block_classes($classes_grid), $block_config, $block_attributes ),
      'classes_item' => apply_filters( 'splx_item_classes', self::block_classes($classes_item), $block_config, $block_attributes ),
      'config' => $block_config
    ];
  }

  public static function template_loader($block_config, $args) {
    $block_type_id = self::get_block_type_id($block_config);
    $loaded_template = '';
    $sage_template = self::get_sage_template($block_config);
    if($sage_template) {
      return self::template_loader_sage($sage_template, $block_config, $args);
    }

    $template = self::get_template($block_config);

    if ($template && file_exists($template)) {

      $validated_file = validate_file($template);
      if (0 === $validated_file) {
        ob_start();
        load_template($template, false, $args);
        $loaded_template = ob_get_clean();

      } else {
        error_log("Solarplexus: Unable to validate template path: \"$template\". Error Code: $validated_file.");
      }
    } else {
      error_log("Solarplexus: Unable to load template for: \"$block_type_id\". File not found.");
    }

    return $loaded_template;
  }

  private static function is_sage(){
    return self::is_sage_sub_10() || self::is_sage_10();
  }

  private static function is_sage_sub_10(){
    return class_exists('Roots\Sage\Container');
  }

  private static function is_sage_10(){
    return function_exists('Roots\view');
  }

  private static function block_classes($classes) {
    $classes = array_unique($classes);
    $classes = join(' ', $classes);
    $classes = ltrim($classes);

    return $classes;
  }

  private static function template_loader_sage($template, $block_config, $args) {
    if (self::is_sage_sub_10()) {
      return self::template_loader_sage_sub_10($template, $block_config, $args);
    }
    if (self::is_sage_10()) {
      return self::template_loader_sage_10($template, $block_config, $args);
    }
    error_log("Solarplexus: No sage template loader.");
  }

  private static function template_loader_sage_sub_10($template, $block_config, $args) {
    // Get the Sage instance with
    // the blade binding
    // TODO: maybe move this container stuff
    // to separate function if needed elsewhere
    $container = Roots\Sage\Container::getInstance();
    $abstract = 'blade';
    $sage = $container->bound($abstract)
        ? $container->makeWith($abstract, [])
        : $container->makeWith("sage.{$abstract}", []);

    $block_type_id = self::get_block_type_id($block_config);

    // Get the rendered template as a string
    $loaded_template = $sage->render($template, $args);

    return $loaded_template;
  }

  private static function template_loader_sage_10($template, $block_config, $args) {
    // Get the rendered template as a string
    $loaded_template = view($template, $args)->render();
    return $loaded_template;
  }

  private static function sage_template_path($block_type_id) {
    return sprintf(
      '%s%s/views/%s/%s.blade.php',
      get_stylesheet_directory(),
      self::is_sage_10() ? '/resources' : '', // NOTE: get_stylesheet_directory() returns the /resources path in Sage 9, but not in Sage 10
      SPLX_TEMPLATE_FOLDER,
      $block_type_id
    );
  }

  private static function get_sage_template($block_config) {
    if (!self::is_sage()) {
      return NULL;
    }
    $block_type_id = self::get_block_type_id($block_config);
    // Check if there is a template file for this block in the theme
    $path = self::sage_template_path($block_type_id);
    if(!file_exists($path)) {
      return NULL;
    }
    // Return template reference in Blade-ish format
    // instead of file path, i.e splx-templates.foo
    return sprintf('%s.%s', SPLX_TEMPLATE_FOLDER, $block_type_id);
  }

  private static function get_template($block_config) {
    $block_type_id = self::get_block_type_id($block_config);
    $template = '';

    // If block id matches a custom
    // regular PHP template in the current theme
    if(!$template) {
      $template = locate_template(
        sprintf(
          '%s/%s.php',
          SPLX_TEMPLATE_FOLDER,
          $block_type_id
        )
      );
    }

    // If nothing yet, use default templates provided
    // by the plugin. Hard-coded template names here
    // since a use case is to have a custom config
    // without creating your own templates.
    if (!$template) {
      if($block_config['type'] == "dynamic") {
        $template = sprintf(
          '%s%s/%s.php',
          SPLX_PLUGIN_PATH,
          SPLX_TEMPLATE_FOLDER,
          'latest-default'
        );
      } else if($block_config['type'] == "handpicked") {
        $template = sprintf(
          '%s%s/%s.php',
          SPLX_PLUGIN_PATH,
          SPLX_TEMPLATE_FOLDER,
          'handpicked-default'
        );
      }

    }

    return $template;
  }

  public static function is_gutenberg_request() {
    return defined('REST_REQUEST') && is_user_logged_in();
  }

  // Rendered post ids are stored in memory (self::$rendered_post_ids), but when the request is through the rest
  // api (e.g. in the Gutenberg editor) they are instead stored in a session variable
  public static function get_rendered_post_ids() {
    if (self::is_gutenberg_request()) {
      self::ensure_php_session();

      return self::get_rendered_post_ids_from_session();
    }

    return self::$rendered_post_ids;
  }

  public static function find_splx_blocks_in_content( $blocks ) {
    $matching_blocks = [];
    foreach ( $blocks as $block ) {
      if ( strpos( $block['blockName'], 'splx/' ) === 0 ) {
        $matching_blocks[] = $block;
      }

      if ( ! empty( $block['innerBlocks'] ) ) {
        $matching_blocks = array_merge( $matching_blocks, self::find_splx_blocks_in_content( $block['innerBlocks'] ) );
      }
    }

    return $matching_blocks;
  }

  public static function set_rendered_post_id($id) {
    if (self::is_gutenberg_request()) {
      self::set_rendered_post_ids_in_session($id);
      return;
    }
    self::$rendered_post_ids[] = $id;
  }

  public static function ensure_php_session() {
    if (session_status() == PHP_SESSION_NONE) {
      session_start();
    }
  }

  public static function get_session_timestamp() {
    return time();
  }

  public static function get_rendered_post_ids_from_session() {
    self::ensure_php_session();

    global $post;
    $rendered_posts_key = 'splx_rendered_posts_' . $post->ID;

    if (isset($_SESSION[ $rendered_posts_key ]) && $_SESSION[ $rendered_posts_key ]['timestamp'] === self::get_session_timestamp() ) {
      return $_SESSION[ $rendered_posts_key ]['ids'];
    }
    return array();
  }

  public static function set_rendered_post_ids_in_session($id) {
    self::ensure_php_session();

    global $post;
    $rendered_posts_key = 'splx_rendered_posts_' . $post->ID;

    if ( ! empty( $_SESSION[ $rendered_posts_key ]['timestamp'] ) && $_SESSION[ $rendered_posts_key ]['timestamp'] === self::get_session_timestamp() ) {
      $_SESSION[ $rendered_posts_key ]['ids'][] = $id;
      return;
    }

    $_SESSION[ $rendered_posts_key ] = array(
      'timestamp' => self::get_session_timestamp(),
      'ids' => [ $id ]
    );
  }

  public static function keep_track_of_rendered_posts($posts) {
    foreach ( $posts as $post ) {
      self::set_rendered_post_id( $post->ID );
    }
    return $posts;
  }

  public static function exclude_rendered_posts_in_args($args) {
    if ( ! isset( $args['post__not_in'] ) ) {
      $args['post__not_in'] = [];
    }

    $args['post__not_in'] = array_unique( array_merge( $args['post__not_in'], self::get_rendered_post_ids() ) );

    return $args;
  }

  public static function block_page_query_parameter($block_attributes) {
    return 'block_' . $block_attributes['blockUid'] . '_page';
  }

  public static function block_page($block_attributes) {
    return isset($_GET[self::block_page_query_parameter($block_attributes)]) ? (int)$_GET[self::block_page_query_parameter($block_attributes)] : 1;
  }

  public static function block_pagination_base($block_attributes) {
    $parsed_url = parse_url($_SERVER['REQUEST_URI']);
    $query = '';
    if (isset($parsed_url['query'])) {
      parse_str($parsed_url['query'], $query_args);
      unset($query_args[self::block_page_query_parameter($block_attributes)]);
      $query = http_build_query($query_args);
    }
    $base_url = $parsed_url['path'] . ($query ? '?' . $query : '');
    return $base_url . ($query ? '&' : '?') . self::block_page_query_parameter($block_attributes) . '=%#%';
  }
}
