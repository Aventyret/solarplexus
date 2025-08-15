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
				filemtime(
					SPLX_PLUGIN_PATH . 'public/themes/twentytwentythree.css'
				)
			);
		}
		if (Solarplexus_Helpers::is_theme_twentytwentyfour()) {
			wp_register_style(
				'solarplexus-style-twentytwentyfour',
				SPLX_PLUGIN_DIR_URL . 'public/themes/twentytwentyfour.css',
				[],
				filemtime(
					SPLX_PLUGIN_PATH . 'public/themes/twentytwentyfour.css'
				)
			);
		}
		if (Solarplexus_Helpers::is_theme_twentytwentyfive()) {
			wp_register_style(
				'solarplexus-style-twentytwentyfive',
				SPLX_PLUGIN_DIR_URL . 'public/themes/twentytwentyfive.css',
				[],
				filemtime(
					SPLX_PLUGIN_PATH . 'public/themes/twentytwentyfive.css'
				)
			);
		}
	}

	/**
	 * Add query vars used in block pagination.
	 */
	public function add_query_vars($vars) {
		$vars[] = 'splx_block_page';
		$vars[] = 'splx_block_uid';

		return $vars;
	}

	/**
	 * Alter the main query for block pagination.
	 *
	 * This is needed to ensure the correct pages is displayed
	 * when custom query vars are present on the front page.
	 */
	public function alter_pre_get_posts($query) {
		if (
			$query->is_main_query() &&
			$query->is_home() &&
			(get_option('show_on_front') === 'page') &&
			get_query_var('splx_block_uid') &&
			get_query_var('splx_block_page')
		) {
			$query->is_home = false;
			$query->is_page = true;
			$query->is_singular = true;
			$query->set('page_id', get_option('page_on_front'));
		}
	}
}
