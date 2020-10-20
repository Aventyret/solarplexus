<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/admin
 * @author     Äventyret <andreas.bohman@aventyret.com>
 */
class Solarplexus_Admin {

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
		$this->config = Solarplexus_Helpers::retrieve_block_configs();

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
		 * defined in Solarplexus_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Solarplexus_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/solarplexus-admin.css', array(), $this->version, 'all' );

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
		 * defined in Solarplexus_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Solarplexus_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/solarplexus-admin.js', array( 'jquery' ), $this->version, false );

	}

	public function register_scripts() {

		wp_register_style(
			'solarplexus-style',
			SPLX_PLUGIN_DIR_URL . 'build/index.css',
			[ 'wp-edit-blocks' ],
			filemtime( SPLX_PLUGIN_PATH . 'build/index.css' )
		);

		wp_register_script(
			'solarplexus-script',
			SPLX_PLUGIN_DIR_URL . 'build/index.js',
			[ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ],
			filemtime( SPLX_PLUGIN_PATH . 'build/index.js' )
		);

		wp_add_inline_script(
			'solarplexus-script',
			'const solarplexusConfig = ' . wp_json_encode( $this->config ),
			'before'
		);

	}

	public function register_block() {
		foreach($this->config as $block_config) {
			$block_type_id = $block_config['id'];
			register_block_type("splx/{$block_type_id}", [
				'editor_script' => 'solarplexus-script',
				'style' => 'solarplexus-style',
				'render_callback' => function($block_attributes, $content) use ($block_config, $block_type_id) {
					$args = Solarplexus_Helpers::block_args($block_config, $block_type_id, $block_attributes);
					$template = Solarplexus_Helpers::template_loader($block_type_id, $args);
	
					return $template;
				}
			]);
		};
	}
}
