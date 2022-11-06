<?php
/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin specific hooks,
 * public facing site hooks and public facing functions.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Solarplexus
 * @subpackage Solarplexus/includes
 */
class Solarplexus {
	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Solarplexus_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if (defined('RULED_DISPLAY_BLOCK_VERSION')) {
			$this->version = RULED_DISPLAY_BLOCK_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'solarplexus';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Solarplexus_Loader. Orchestrates the hooks of the plugin.
	 * - Solarplexus_i18n. Defines internationalization functionality.
	 * - Solarplexus_Admin. Defines all hooks for the admin area.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {
		require_once plugin_dir_path(dirname(__FILE__)) .
			'includes/class-solarplexus-helpers.php';

		require_once plugin_dir_path(dirname(__FILE__)) .
			'includes/objects/class-solarplexus-block-attrs-definition.php';
		require_once plugin_dir_path(dirname(__FILE__)) .
			'includes/objects/class-solarplexus-dynamic-block-attrs-definition.php';
		require_once plugin_dir_path(dirname(__FILE__)) .
			'includes/objects/class-solarplexus-handpicked-block-attrs-definition.php';

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path(dirname(__FILE__)) .
			'includes/class-solarplexus-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path(dirname(__FILE__)) .
			'includes/class-solarplexus-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path(dirname(__FILE__)) .
			'admin/class-solarplexus-admin.php';

		$this->loader = new Solarplexus_Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Solarplexus_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {
		$plugin_i18n = new Solarplexus_i18n();

		$this->loader->add_action(
			'plugins_loaded',
			$plugin_i18n,
			'load_plugin_textdomain'
		);
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {
		$plugin_admin = new Solarplexus_Admin(
			$this->get_plugin_name(),
			$this->get_version()
		);

		$this->loader->add_action(
			'admin_enqueue_scripts',
			$plugin_admin,
			'enqueue_styles'
		);
		$this->loader->add_action(
			'init',
			$plugin_admin,
			'register_scripts',
			11
		);
		$this->loader->add_action('init', $plugin_admin, 'register_block', 11);
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Solarplexus_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Render a blocks pagination.
	 *
	 * @since     1.3.0
	 * @param     array      $block_attributes_or_args Associative array with args if not called from a Sage template. Or the block attributes if called from a sage template
	 * @param     array      $pagination OPTIONAL Associative array with args if not called from a Sage template. Or the block attributes if called from a sage template
	 * @throws    Exception  If the arguments are bad
	 * @return    void    	 Outputs html with pagination for a block, or nothing if the block does not support pagination.
	 */
	public static function the_block_pagination(
		$block_attributes_or_args,
		$pagination = null
	) {
		$args = [];
		if ($pagination === null) {
			$args = $block_attributes_or_args;
		}
		if ($pagination !== null) {
			$args = [
				'block_attributes' => $block_attributes_or_args,
				'pagination' => $pagination,
			];
		}
		if (
			!isset($args['block_attributes']) ||
			!isset($args['block_attributes']['hasPagination']) ||
			!$args['block_attributes']['hasPagination']
		) {
			// Block does not support pagination
			return;
		}
		$arg_properties = ['block_attributes', 'pagination'];
		foreach ($arg_properties as $property) {
			if (!isset($args[$property]) || !$args[$property]) {
				throw new Exception(
					'Bad arguments for Solarplexus::the_block_pagination($args)'
				);
			}
		}
		$pagination_base = Solarplexus_Helpers::block_pagination_base(
			$args['block_attributes']
		);

		echo '
<div class="splx-pagination">
	' .
			paginate_links([
				'base' => $pagination_base,
				'current' => $args['pagination']['page'],
				'total' => $args['pagination']['max_num_pages'],
				'format' =>
					'?' .
					Solarplexus_Helpers::block_page_query_parameter(
						$args['block_attributes']
					) .
					'=%#%',
				'type' => 'list',
			]) .
			'
</div>';
	}
}
