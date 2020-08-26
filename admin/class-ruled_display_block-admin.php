<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Ruled_display_block
 * @subpackage Ruled_display_block/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Ruled_display_block
 * @subpackage Ruled_display_block/admin
 * @author     Äventyret <andreas.bohman@aventyret.com>
 */
class Ruled_display_block_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	private $config;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->config = Ruled_display_block_Helpers::retrieve_block_config();

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Ruled_display_block_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Ruled_display_block_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/ruled_display_block-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Ruled_display_block_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Ruled_display_block_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/ruled_display_block-admin.js', array( 'jquery' ), $this->version, false );

	}

	public function register_scripts() {

		wp_register_style(
			'ruled-display-block-style',
			RDB_PLUGIN_DIR_URL . 'build/index.css',
			[ 'wp-edit-blocks' ],
			filemtime( RDB_PLUGIN_PATH . 'build/index.css' )
		);

		wp_register_script(
			'ruled-display-block-script',
			RDB_PLUGIN_DIR_URL . 'build/index.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ],
			filemtime( RDB_PLUGIN_PATH . 'build/index.js' )
		);

		wp_add_inline_script(
			'ruled-display-block-script',
			'const ruledDisplayBlockConfig = ' . wp_json_encode( $this->config ),
			'before'
		);

	}

	public function register_block() {
		register_block_type('rdb/ruled-display-block', [
			'editor_script' => 'ruled-display-block-script',
			'style' => 'ruled-display-block-style',
			'render_callback' => function($block_attributes, $content) {
				$args = $this->block_args($block_attributes);
				$template = $this->template_loader('ruled-display-block', $args);

				return $template;
			}
		]);
		register_block_type('rdb/handpicked-display-block', [
			'editor_script' => 'ruled-display-block-script',
			'style' => 'ruled-display-block-style',
			'render_callback' => function($block_attributes, $content) {
				$args = $this->block_args($block_attributes);
				$template = $this->template_loader('handpicked-display-block', $args);

				return $template;
			}
		]);
	}

	public function block_args($block_attributes) {
		$current_post_id = get_the_id();

		$args = [
			'post_status' => 'publish'
		];

		if($current_post_id) {
			$args['post__not_in'] = array($current_post_id);
		}

		if (array_key_exists('postType', $block_attributes)) {
			$args['post_type'] = $block_attributes['postType'];

			// TODO this may be an attribute later
			// if editor should be able to select
			$args['posts_per_page'] = $this->config['noOfPosts'];
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
			'block_attributes' => $block_attributes,

			// Expose config so that template can
			// adjust to noOfCols and such
			'config' => $this->config
		];
	}

	public function template_loader($block, $block_attributes) {
		$loaded_template = '';
		$template = $this->get_template($block);

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

	public function get_template($block) {
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
