<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://aventyret.com
 * @since             1.0.0
 * @package           Ruled_display_block
 *
 * @wordpress-plugin
 * Plugin Name:       Solarplexus
 * Plugin URI:        https://aventyret.com
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Äventyret
 * Author URI:        https://aventyret.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       ruled_display_block
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'RDB_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'RDB_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );
define( 'RDB_TEMPLATE_FOLDER', 'rdb-templates' );

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'RULED_DISPLAY_BLOCK_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-ruled_display_block-activator.php
 */
function activate_ruled_display_block() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-ruled_display_block-activator.php';
	Ruled_display_block_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-ruled_display_block-deactivator.php
 */
function deactivate_ruled_display_block() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-ruled_display_block-deactivator.php';
	Ruled_display_block_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_ruled_display_block' );
register_deactivation_hook( __FILE__, 'deactivate_ruled_display_block' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-ruled_display_block.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_ruled_display_block() {

	$plugin = new Ruled_display_block();
	$plugin->run();

}
run_ruled_display_block();
