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
 * @package           Solarplexus
 *
 * @wordpress-plugin
 * Plugin Name:       Solarplexus
 * Plugin URI:        https://aventyret.com
 * Description:       A plugin and developer tool to easily create Gutenberg blocks for creating dynamic and static lists of posts, pages and more.
 * Version:           1.11.2
 * Author:            Äventyret
 * Author URI:        https://aventyret.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       splx
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die();
}

define('SPLX_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('SPLX_PLUGIN_DIR_URL', plugin_dir_url(__FILE__));
define('SPLX_TEMPLATE_FOLDER', 'splx-templates');

/**
 * Current plugin version.
 * We use SemVer - https://semver.org
 */
define('SOLARPLEXUS_VERSION', '1.11.2');

/**
 * The core plugin class that is used to define internationalization,
 * admin specific hooks, and public facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-solarplexus.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_solarplexus() {
	$plugin = new Solarplexus();
	$plugin->run();
}
run_solarplexus();
