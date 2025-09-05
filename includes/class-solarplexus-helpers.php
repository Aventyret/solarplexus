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
	// Used to know which block we are in
	private static $block_index = 0;
	// Used to keep track of if custom ssr component is used
	private static $did_use_custom_editor_ssr_component = false;

	public static function get_theme_config_path() {
		return get_stylesheet_directory() .
			(self::is_sage_10() ? '/resources' : '') .
			'/splx-config.json'; // NOTE: get_stylesheet_directory() returns the /resources path in Sage 10, but not in Sage 9
	}

	public static function retrieve_block_configs() {
		$splx_config = [];

		// Start by seeing if theme has a json config file
		$theme_config_path =
			get_stylesheet_directory() .
			(self::is_sage_10() ? '/resources' : '') .
			'/splx-config.json'; // NOTE: get_stylesheet_directory() returns the /resources path in Sage 10, but not in Sage 9

		if (file_exists($theme_config_path)) {
			$splx_config = self::get_json_config($theme_config_path);
		}

		// Allow adjustments (or creation) of config with filter
		$splx_config = apply_filters('splx_config', $splx_config);

		// If there is no config at this point, use the plugin default blocks
		if (empty($splx_config)) {
			$splx_config = self::get_json_config(
				SPLX_PLUGIN_PATH . 'splx-config.json'
			);
		}

		return $splx_config;
	}

	public static function retrieve_block_config($block_type_id) {
		foreach (self::retrieve_block_configs() as $block_config) {
			if ($block_type_id == self::get_block_type_id($block_config)) {
				return $block_config;
			}
		}
		return null;
	}

	private static function get_json_config($config_path) {
		return wp_json_file_decode($config_path, ['associative' => true]);
	}

	public static function get_block_type_id($block_config) {
		$id = null;
		if (array_key_exists('id', $block_config)) {
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

		if (isset($block_config['noOfGridCols'])) {
			// Set grid and item classes from attributes
			$attrs_grid['cols'] = [
				'class_base' => 'splx-grid--cols',
				'value' => $block_config['noOfGridCols'],
				'divider' => '',
			];
			$attrs_item['cols'] = [
				'class_base' => 'splx-gridItemPost--cols',
				'value' => $block_config['noOfGridCols'],
				'divider' => '',
			];
		}

		// Add itemLayout
		// directly from config instead
		// of from block attributes.
		if (isset($attrs_grid['itemLayout'])) {
			$attrs_item['itemLayout'] = [
				'class_base' => 'splx-gridItemPost--layout',
				'value' => $block_config['itemLayout'],
				'divider' => '-',
			];
		}

		foreach ($attrs_grid as $attribute) {
			$classes_grid[] = sprintf(
				'%s%s%s',
				$attribute['class_base'],
				$attribute['divider'],
				$attribute['value']
			);
		}

		foreach ($attrs_item as $key => $attribute) {
			$classes_item[] = sprintf(
				'%s%s%s',
				$attribute['class_base'],
				$attribute['divider'],
				$attribute['value']
			);
		}

		// Query posts
		$post_status = 'publish';
		if (
			self::is_gutenberg_request() &&
			isset($block_config['allowedPostStatuses']) &&
			!empty($block_config['allowedPostStatuses'])
		) {
			$post_status = $block_config['allowedPostStatuses'];
		}
		$args = [
			'post_status' => $post_status,
			'ignore_sticky_posts' => true,
		];

		$current_post_id = get_the_ID();

		if ($current_post_id) {
			$args['post__not_in'] = [$current_post_id];
		}

		if (array_key_exists('noOfPosts', $block_attributes)) {
			$args['posts_per_page'] = $block_attributes['noOfPosts'];
		}

		if (array_key_exists('postType', $block_attributes)) {
			$args['post_type'] = explode(',', $block_attributes['postType']);
			$args['orderby'] = 'date';
		} else {
			$args['post_type'] = 'any';
		}

		if (array_key_exists('orderby', $block_attributes)) {
			$args['orderby'] = $block_attributes['orderby'];
			if (in_array($args['orderby'], ['meta_value', 'meta_value_num'])) {
				$args['meta_key'] = $block_attributes['orderbyMetaKey'];
			}
		}

		if (array_key_exists('order', $block_attributes)) {
			$args['order'] = strtoupper($block_attributes['order']);
		}

		// NOTE: Legacy tax_query from before multiple taxonomies
		if (
			array_key_exists('taxonomy', $block_attributes) &&
			array_key_exists('terms', $block_attributes) &&
			!empty($block_attributes['terms'])
		) {
			$args['tax_query'] = [];
			$args['tax_query'][] = [
				'taxonomy' => $block_attributes['taxonomy'],
				'field' => 'term_id',
				'terms' => $block_attributes['terms'],
			];
		}

		/**
		 * @since    1.9.0
		 */
		if (
			array_key_exists('taxonomyTerms', $block_attributes) &&
			!empty($block_attributes['taxonomyTerms'])
		) {
			$args['tax_query'] = ['relation' => 'AND'];
			foreach ($block_attributes['taxonomyTerms'] as $taxonomy) {
				if (!empty($taxonomy['terms'])) {
					$args['tax_query'][] = [
						'taxonomy' => $taxonomy['slug'],
						'field' => 'term_id',
						'terms' => $taxonomy['terms'],
					];
				}
			}
		}

		/**
		 * @since    1.2.0
		 */
		if (
			array_key_exists('authors', $block_attributes) &&
			!empty($block_attributes['authors'])
		) {
			$args['author__in'] = $block_attributes['authors'];
		}

		if (array_key_exists('searchResults', $block_attributes)) {
			$args['post__in'] = wp_list_pluck(
				$block_attributes['searchResults'],
				'id'
			);
			/**
			 * @since    1.10.0
			 * Optionaly hide duplicates in hand picked blocks
			 */
			if (
				array_key_exists('hideDuplicates', $block_attributes) &&
				$block_attributes['hideDuplicates']
			) {
				$args['post__in'] = array_filter($args['post__in'], function (
					$post_id
				) {
					if (in_array($post_id, self::$rendered_post_ids)) {
						return false;
					}
					return true;
				});
			}
			/**
			 * End hide duplicates in hand picked blocks
			 */
			/**
			 * @since    1.16.0
			 * Optionaly randomize hand picked blocks
			 * Randomize can be controlled by config or by block attribute
			 */
			$randomize =
				(isset($block_config['randomize']) &&
					$block_config['randomize']) ||
				(isset($block_config['allowRandomize']) &&
					$block_config['allowRandomize'] &&
					array_key_exists('randomize', $block_attributes) &&
					$block_attributes['randomize']);
			if ($randomize) {
				shuffle($args['post__in']);
			}
			/**
			 * End randomize hand picked blocks
			 */
			if (empty($args['post__in'])) {
				$args['post__in'][] = 0;
			}
			if (!array_key_exists('orderby', $args)) {
				$args['orderby'] = 'post__in';
			}
		}

		$allow_duplicates = $block_config['allowDuplicates'] ?? false;
		$handpicked = ($block_config['type'] ?? '') === 'handpicked';
		if (!$allow_duplicates && !$handpicked) {
			// Exclude previously rendered posts from the query args
			$args = self::exclude_rendered_posts_in_args($args);
		}

		$args['offset'] = 0;
		$allow_offset = $block_config['allowOffset'] ?? false;
		if ($allow_offset) {
			$args['offset'] = $block_attributes['offset'];
		}

		$allow_pagination = $block_config['allowPagination'] ?? false;
		$has_pagination =
			$allow_pagination &&
			isset($block_attributes['hasPagination']) &&
			$block_attributes['hasPagination'];
		if (
			$has_pagination &&
			isset($block_attributes['noOfPosts']) &&
			$block_attributes['noOfPosts'] > -1
		) {
			$args['offset'] +=
				(self::block_page($block_attributes) - 1) *
				$block_attributes['noOfPosts'];

			$args['paged'] = self::block_page($block_attributes);
		}

		if (array_key_exists('handpickedPosts', $block_attributes)) {
			// Handpicked in dynamic: Exclude from query and add later
			foreach ($block_attributes['handpickedPosts'] as $handpicked) {
				$args['post__not_in'][] = $handpicked['post']['id'];
			}

			// Rewind offset on pages > 1
			if ((!empty($args['paged']) && $args['paged'] > 1)) {
				$args['offset'] = absint(($args['paged'] - 1) * $args['posts_per_page']) - count($block_attributes['handpickedPosts']);
			}
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
		$args = apply_filters(
			'splx_queryargs',
			$args,
			$block_config,
			$block_attributes
		);

		$query = new WP_Query($args);

		$posts = $query->posts;

		if (array_key_exists('handpickedPosts', $block_attributes) &&
			(empty($args['paged']) || $args['paged'] <= 1)) {
			// Handpicked in dynamic: Correct order
			usort($block_attributes['handpickedPosts'], function($a, $b) {
			    return ($a['position'] < $b['position']) ? -1 : 1;
			});

			// Add to result
			$addedPosts = 0;
			foreach ($block_attributes['handpickedPosts'] as $handpicked) {
				$postToAdd = get_post($handpicked['post']['id']);
				if ($postToAdd) {
					// Count up $addedPosts, which means one more post will be removed with array_slice
					$addedPosts++;

					// Add the post at it's handpicked position
					array_splice($posts, (int) $handpicked['position'] - 1, 0, [
						$postToAdd,
					]);
				}
			}

			// Remove as many posts from end as we have added to $posts
			$posts = array_slice($posts, 0, count($posts) - $addedPosts);
		}

		// Is this block paginated?
		$pagination = false;
		if ($has_pagination) {
			$permalink = get_permalink();
			$next_url_permalink = apply_filters(
				'splx_pagination_next_url_permalink',
				$permalink
			);

			$pagination = [
				'page' => self::block_page($block_attributes),
				'max_num_pages' => $query->max_num_pages,
				'next_url' =>
					self::block_page($block_attributes) < $query->max_num_pages
						? rtrim($next_url_permalink, '/') .
							'?' .
							self::block_page_query_parameter(
								$block_attributes
							) .
							'=' .
							(self::block_page($block_attributes) + 1)
						: null,
			];
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
		$posts = apply_filters(
			'splx_posts',
			$posts,
			$block_config,
			$block_attributes,
			$pagination
		);

		// Keep track of rendered posts to avoid rendering same post multiple times on a page
		self::keep_track_of_rendered_posts($posts);

		$block_index = self::$block_index;
		self::$block_index++;

		// If key postCustomControls exists in searchResults, add it to the post object
		if (isset($block_attributes['searchResults'])) {
			foreach (
				$block_attributes['searchResults']
				as $key => $searchResult
			) {
				if (
					isset($searchResult['postCustomControls']) &&
					isset($posts[$key])
				) {
					$posts[$key]->post_custom_controls =
						$searchResult['postCustomControls'];
				}
			}
		}

		return apply_filters(
			'splx_block_args',
			[
				'query' => $query->query,
				'posts' => $posts,
				'pagination' => $pagination,
				'block_attributes' => $block_attributes,
				'block_index' => $block_index,
				'classes_grid' => apply_filters(
					'splx_grid_classes',
					self::block_classes($classes_grid),
					$block_config,
					$block_attributes
				),
				'classes_item' => apply_filters(
					'splx_item_classes',
					self::block_classes($classes_item),
					$block_config,
					$block_attributes
				),
				'config' => $block_config,
			],
			$block_type_id
		);
	}

	public static function template_loader($block_config, $args) {
		$block_type_id = self::get_block_type_id($block_config);
		$loaded_template = '';

		$loaded_template = self::render_with_callback($block_config, $args);
		if ($loaded_template !== false) {
			return $loaded_template;
		}

		$sage_template = self::get_sage_template($block_config);
		if ($sage_template) {
			return self::template_loader_sage(
				$sage_template,
				$block_config,
				$args
			);
		}

		$template = self::get_template($block_config);

		if ($template && file_exists($template)) {
			$validated_file = validate_file($template);
			if (0 === $validated_file) {
				ob_start();
				load_template($template, false, $args);
				$loaded_template = ob_get_clean();
			} else {
				// NOTE: Possibly display admin notice here?
			}
		} else {
			// NOTE: Possibly display admin notice here?
		}

		return $loaded_template;
	}

	private static function is_sage() {
		return self::is_sage_sub_10() || self::is_sage_10();
	}

	private static function is_sage_sub_10() {
		return class_exists('Roots\Sage\Container');
	}

	private static function is_sage_10() {
		return function_exists('Roots\view') && current_theme_supports('sage');
	}

	private static function block_classes($classes) {
		$classes = array_unique($classes);
		$classes = join(' ', $classes);
		$classes = ltrim($classes);

		return $classes;
	}

	private static function render_with_callback($block_config, $args) {
		$block_type_id = self::get_block_type_id($block_config);
		// Run filter to see if a render callback is registered for block
		return apply_filters(
			'splx_block_render_callback',
			false,
			$args,
			$block_type_id
		);
	}

	private static function template_loader_sage(
		$template,
		$block_config,
		$args
	) {
		if (self::is_sage_sub_10()) {
			return self::template_loader_sage_sub_10(
				$template,
				$block_config,
				$args
			);
		}
		if (self::is_sage_10()) {
			return self::template_loader_sage_10(
				$template,
				$block_config,
				$args
			);
		}
		// NOTE: Possibly display admin notice here?
	}

	private static function template_loader_sage_sub_10(
		$template,
		$block_config,
		$args
	) {
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

	private static function template_loader_sage_10(
		$template,
		$block_config,
		$args
	) {
		// Get the rendered template as a string
		$loaded_template = view($template, $args)->render();
		return $loaded_template;
	}

	private static function sage_template_path($block_type_id) {
		return sprintf(
			'%s%s/views/%s/%s.blade.php',
			get_stylesheet_directory(),
			self::is_sage_10() ? '/resources' : '', // NOTE: get_stylesheet_directory() returns the /resources path in Sage 10, but not in Sage 9
			SPLX_TEMPLATE_FOLDER,
			$block_type_id
		);
	}

	private static function get_sage_template($block_config) {
		if (!self::is_sage()) {
			return null;
		}
		$block_type_id = self::get_block_type_id($block_config);
		// Check if there is a template file for this block in the theme
		$path = self::sage_template_path($block_type_id);
		if (!file_exists($path)) {
			return null;
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
		if (!$template) {
			$template = locate_template(
				sprintf('%s/%s.php', SPLX_TEMPLATE_FOLDER, $block_type_id)
			);
		}

		// If nothing yet, use default templates provided
		// by the plugin. Hard-coded template names here
		// since a use case is to have a custom config
		// without creating your own templates.
		if (!$template) {
			if (self::is_theme_twentytwentythree()) {
				$template = sprintf(
					'%s%s/%s.php',
					SPLX_PLUGIN_PATH,
					SPLX_TEMPLATE_FOLDER,
					'twentytwentythree'
				);
			} elseif (self::is_theme_twentytwentyfour()) {
				$template = sprintf(
					'%s%s/%s.php',
					SPLX_PLUGIN_PATH,
					SPLX_TEMPLATE_FOLDER,
					'twentytwentyfour'
				);
			} elseif (self::is_theme_twentytwentyfive()) {
				$template = sprintf(
					'%s%s/%s.php',
					SPLX_PLUGIN_PATH,
					SPLX_TEMPLATE_FOLDER,
					'twentytwentyfive'
				);
			} else {
				$template = sprintf(
					'%s%s/%s.php',
					SPLX_PLUGIN_PATH,
					SPLX_TEMPLATE_FOLDER,
					'default'
				);
			}
		}

		return $template;
	}

	public static function is_theme_twentytwentythree() {
		return get_stylesheet() == 'twentytwentythree';
	}

	public static function is_theme_twentytwentyfour() {
		return get_stylesheet() == 'twentytwentyfour';
	}

	public static function is_theme_twentytwentyfive() {
		return get_stylesheet() == 'twentytwentyfive';
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

	public static function block_is_unpublished(
		$block_config,
		$block_attributes
	) {
		if (
			!isset($block_config['allowScheduling']) ||
			!$block_config['allowScheduling']
		) {
			return false;
		}
		return (!empty($block_attributes['publishAt']) &&
			time() < strtotime($block_attributes['publishAt'])) ||
			(!empty($block_attributes['unpublishAt']) &&
				time() >= strtotime($block_attributes['unpublishAt']));
	}

	public static function find_splx_blocks_in_content($blocks) {
		$matching_blocks = [];
		foreach ($blocks as $block) {
			if (strpos($block['blockName'], 'splx/') === 0) {
				$matching_blocks[] = $block;
			}

			if (!empty($block['innerBlocks'])) {
				$matching_blocks = array_merge(
					$matching_blocks,
					self::find_splx_blocks_in_content($block['innerBlocks'])
				);
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

		if (
			isset($_SESSION[$rendered_posts_key]['timestamp']) &&
			isset($_SESSION[$rendered_posts_key]['ids']) &&
			$_SESSION[$rendered_posts_key]['timestamp'] ===
				self::get_session_timestamp()
		) {
			if (is_array($_SESSION[$rendered_posts_key]['ids'])) {
				return array_unique(
					array_map('absint', $_SESSION[$rendered_posts_key]['ids'])
				);
			}
		}
		return [];
	}

	public static function set_rendered_post_ids_in_session($id) {
		self::ensure_php_session();

		global $post;
		$rendered_posts_key = 'splx_rendered_posts_' . $post->ID;

		if (
			isset($_SESSION[$rendered_posts_key]['timestamp']) &&
			isset($_SESSION[$rendered_posts_key]['ids']) &&
			!empty($_SESSION[$rendered_posts_key]['timestamp']) &&
			$_SESSION[$rendered_posts_key]['timestamp'] ===
				self::get_session_timestamp()
		) {
			$_SESSION[$rendered_posts_key]['ids'][] = esc_attr($id);
			return;
		}

		$_SESSION[$rendered_posts_key] = [
			'timestamp' => self::get_session_timestamp(),
			'ids' => [$id],
		];
	}

	public static function keep_track_of_rendered_posts($posts) {
		foreach ($posts as $post) {
			self::set_rendered_post_id($post->ID);
		}
		return $posts;
	}

	public static function exclude_rendered_posts_in_args($args) {
		if (!isset($args['post__not_in'])) {
			$args['post__not_in'] = [];
		}

		$args['post__not_in'] = array_unique(
			array_merge($args['post__not_in'], self::get_rendered_post_ids())
		);

		return $args;
	}

	public static function block_page_query_parameter($block_attributes) {
		return 'splx_block_uid=' . $block_attributes['blockUid'] . '&splx_block_page';
	}

	public static function block_page($block_attributes) {
		$block_id = get_query_var('splx_block_uid');
		$page = get_query_var('splx_block_page');

		if (
			empty($page) ||
			empty($block_attributes['blockUid']) ||
			$block_id !== $block_attributes['blockUid']
		) {
			return 1;
		}
		return (int) $page;
	}

	public static function block_pagination_base($block_attributes) {
		$parsed_url = wp_parse_url(
			isset($_SERVER['REQUEST_URI'])
				? sanitize_url(wp_unslash($_SERVER['REQUEST_URI']))
				: ''
		);
		$query = '';
		if (isset($parsed_url['query'])) {
			parse_str($parsed_url['query'], $query_args);
			unset(
				$query_args[self::block_page_query_parameter($block_attributes)]
			);
			$query = http_build_query($query_args);
		}
		$base_url = $parsed_url['path'] . ($query ? '?' . $query : '');
		return $base_url .
			($query ? '&' : '?') .
			self::block_page_query_parameter($block_attributes) .
			'=%#%';
	}

	private static function add_editor_inline_script(
		$data,
		$before_or_after = 'after'
	) {
		add_action('splx_editor_script_registered', function () use (
			$data,
			$before_or_after
		) {
			wp_add_inline_script('solarplexus-script', $data, $before_or_after);
		});
	}

	public static function use_custom_editor_ssr_component() {
		if (self::$did_use_custom_editor_ssr_component) {
			return;
		}
		self::add_editor_inline_script(
			'window.solarplexusOptions = window.solarplexusOptions || {}; window.solarplexusOptions.postponeBlockRegistration = true;',
			'before'
		);
		self::add_editor_inline_script(
			'window.setTimeout(() => window.dispatchEvent(new Event("splx_register_blocks")), 0);',
			'after'
		);
		self::$did_use_custom_editor_ssr_component = true;
	}
}
