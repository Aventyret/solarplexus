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
		$config = Ruled_display_block_Helpers::retrieve_block_config();

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
			'const ruledDisplayBlockConfig = ' . wp_json_encode( $config ),
			'before'
		);

	}

	public function register_block() {
		register_block_type('rdb/ruled-display-block', [
			'editor_script' => 'ruled-display-block-script',
			'style' => 'ruled-display-block-style',
			'render_callback' => function($block_attributes, $content) {
				$args = Ruled_display_block_Helpers::block_args($block_attributes);
				$template = Ruled_display_block_Helpers::template_loader('ruled-display-block', $args);

				return $template;
			}
		]);
		register_block_type('rdb/handpicked-display-block', [
			'editor_script' => 'ruled-display-block-script',
			'style' => 'ruled-display-block-style',
			'render_callback' => function($block_attributes, $content) {
				$args = Ruled_display_block_Helpers::block_args($block_attributes);
				$template = Ruled_display_block_Helpers::template_loader('handpicked-display-block', $args);

				return $template;
			}
		]);
	}
}
