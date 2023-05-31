<?php
/**
 * The public specific functionality of the plugin.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/public
 */
class Solarplexus_Public {
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
	public function __construct($plugin_name, $version) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the public area.
	 *
	 * @since    1.0.0
	 */
	public function register_style() {
		wp_register_style(
			'solarplexus-style',
			SPLX_PLUGIN_DIR_URL . 'build/index.css',
			[],
			filemtime(SPLX_PLUGIN_PATH . 'build/index.css')
		);
		if (Solarplexus_Helpers::is_theme_twentytwentythree()) {
		  wp_register_style(
		  	'solarplexus-style-twentytwentythree',
		  	SPLX_PLUGIN_DIR_URL . 'public/themes/twentytwentythree.css',
		  	[],
		  	filemtime(SPLX_PLUGIN_PATH . 'public/themes/twentytwentythree.css')
		  );
		}
	}
}
