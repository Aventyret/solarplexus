<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Ruled_display_block
 * @subpackage Ruled_display_block/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Ruled_display_block
 * @subpackage Ruled_display_block/includes
 * @author     Äventyret <andreas.bohman@aventyret.com>
 */
class Ruled_display_block_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'ruled_display_block',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
