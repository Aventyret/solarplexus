<?php
/**
 * The admin specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin specific stylesheet.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/admin
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
	public function __construct($plugin_name, $version) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->config = [];
	}

	private function get_config() {
		$this->config = empty($this->config)
			? Solarplexus_Helpers::retrieve_block_configs()
			: $this->config;

		return $this->config;
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

		wp_enqueue_style(
			$this->plugin_name,
			plugin_dir_url(__FILE__) . 'css/solarplexus-admin.css',
			[],
			$this->version,
			'all'
		);
	}

	public function register_scripts() {
		wp_register_style(
			'solarplexus-style',
			SPLX_PLUGIN_DIR_URL . 'build/index.css',
			['wp-edit-blocks'],
			filemtime(SPLX_PLUGIN_PATH . 'build/index.css')
		);

		if (Solarplexus_Helpers::is_theme_twentytwentythree()) {
			wp_register_style(
				'solarplexus-style-twentytwentythree',
				SPLX_PLUGIN_DIR_URL . 'public/themes/twentytwentythree.css',
				['wp-edit-blocks'],
				filemtime(
					SPLX_PLUGIN_PATH . 'public/themes/twentytwentythree.css'
				)
			);
		}

		wp_register_script(
			'solarplexus-script',
			SPLX_PLUGIN_DIR_URL . 'build/index.js',
			[
				'wp-blocks',
				'wp-element',
				'wp-editor',
				'wp-components',
				'wp-i18n',
				'wp-api-fetch',
			],
			filemtime(SPLX_PLUGIN_PATH . 'build/index.js')
		);

		wp_add_inline_script(
			'solarplexus-script',
			'window.solarplexusConfig = ' .
				wp_json_encode($this->get_config()) .
				';',
			'before'
		);

		$attr_defs_per_config = [];
		foreach ($this->get_config() as $block_config) {
			$instance = null;
			$block_type_id = Solarplexus_Helpers::get_block_type_id(
				$block_config
			);
			if ($block_config['type'] == 'dynamic') {
				$instance = new Solarplexus_Dynamic_Block_Attrs_Definition(
					$block_config
				);
			} elseif ($block_config['type'] == 'handpicked') {
				$instance = new Solarplexus_Handpicked_Block_Attrs_Definition(
					$block_config
				);
			} else {
				continue;
			}
			$attr_defs_per_config[$block_type_id] = $instance->to_array();
		}

		wp_add_inline_script(
			'solarplexus-script',
			'window.solarplexusAttrDefs = ' .
				wp_json_encode($attr_defs_per_config) .
				';',
			'before'
		);

		wp_set_script_translations(
			'solarplexus-script',
			'splx',
			SPLX_PLUGIN_PATH . 'languages'
		);
	}

	public function register_block() {
		$enable_default_style = apply_filters(
			'splx_enable_default_style',
			false
		);
		$block_style_handle = 'solarplexus-style';
		$theme_config_path = Solarplexus_Helpers::get_theme_config_path();

		if (file_exists($theme_config_path) && !$enable_default_style) {
			$block_style_handle = 'solarplexus-style-custom';
		}
		if (Solarplexus_Helpers::is_theme_twentytwentythree()) {
			$block_style_handle = 'solarplexus-style-twentytwentythree';
		}

		foreach ($this->get_config() as $block_config) {
			$block_type_id = Solarplexus_Helpers::get_block_type_id(
				$block_config
			);
			$attributes = [];

			if ($block_config['type'] == 'dynamic') {
				$instance = new Solarplexus_Dynamic_Block_Attrs_Definition(
					$block_config
				);
				$attributes = $instance->to_array();
			} elseif ($block_config['type'] == 'handpicked') {
				$instance = new Solarplexus_Handpicked_Block_Attrs_Definition(
					$block_config
				);
				$attributes = $instance->to_array();
			} else {
				throw new Exception(
					"Cannot create block '{$block_type_id}', type must be either 'dynamic' or 'handpicked'."
				);
			}

			register_block_type("splx/{$block_type_id}", [
				'attributes' => $attributes,
				'editor_script' => 'solarplexus-script',
				'style' => $block_style_handle,
				'render_callback' => function (
					$block_attributes,
					$content
				) use ($block_config, $block_type_id) {
					$args = Solarplexus_Helpers::block_args(
						$block_config,
						$block_attributes
					);
					$template = trim(
						Solarplexus_Helpers::template_loader(
							$block_config,
							$args
						)
					);
					if (!Solarplexus_Helpers::is_gutenberg_request()) {
						return $template;
					}
					return $template
						? '<div class="wp-block wp-block-splx wp-block-splx--' .
								$block_type_id .
								'">' .
								$template .
								'</div>'
						: '';
				},
			]);
		}
	}

	public function register_endpoints() {
		register_rest_route(SPLX_API_BASE, '/search', [
			'methods' => 'GET',
			'callback' => function () {
				$s = strtolower(
					isset($_GET['s']) && strlen($_GET['s'] > 2)
						? $_GET['s']
						: ''
				);
				if (!$s) {
					throw new Exception('Search for a minimum of 2 characters');
					wp_die();
				}
				$post_status = isset($_GET['status'])
					? explode(',', $_GET['status'])
					: ['publish'];
				$post_type =
					isset($_GET['post_type']) && $_GET['post_type']
						? explode(',', $_GET['post_type'])
						: 'any';
				$posts_per_page = isset($_GET['per_page'])
					? $_GET['per_page']
					: 30;
				$posts = get_posts([
					's' => $s,
					'post_status' => $post_status,
					'post_type' => $post_type,
					'posts_per_page' => 100,
				]);
				$posts = array_map(function ($p) {
					return [
						'id' => $p->ID,
						'title' => $p->post_title,
						'url' => get_permalink($p->ID),
						'type' => $p->post_type,
						'subtype' => $p->post_type,
					];
				}, $posts);
				usort($posts, function ($a, $b) use ($s) {
					$titleA = strtolower($a['title']);
					$titleB = strtolower($b['title']);
					if ($titleA === $s) {
						return -1;
					}
					if ($titleB === $s) {
						return 1;
					}
					if ($titleA && strpos($titleA, $s) === 0) {
						return -1;
					}
					if ($titleB && strpos($titleB, $s) === 0) {
						return 1;
					}
					if (strpos($titleA, $s) !== false) {
						return -1;
					}
					if (strpos($titleB, $s) !== false) {
						return 1;
					}
					return 0;
				});
				return array_slice($posts, 0, $posts_per_page);
			},
			'permission_callback' => function ($request) {
				return true;
				// $can_search = current_user_can('edit_posts');
				// return apply_filters('splx_can_search_in_admin', $can_search);
			},
		]);
	}
}
