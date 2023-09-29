<?php
/**
 * Block attribute definitions used for all block types.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/includes/objects
 */
class Solarplexus_Block_Attrs_Definition {
	/*
	 *
	 * Public vars
	 */
	public $block_uid;

	public $no_of_posts;

	public $custom_controls;

	/*
	 *
	 * Private vars
	 */
	protected $config;

	/*
	 *
	 * Public methods
	 */
	public function __construct($block_config) {
		$this->config = $block_config;

		$this->set_block_uid();
		$this->set_no_of_posts();
		$this->set_custom_controls();
	}

	public function to_array() {
		$r = [];
		$r['blockUid'] = $this->block_uid;
		$r['noOfPosts'] = $this->no_of_posts;
		foreach ($this->custom_controls as $control_id => $control) {
			$r[$control_id] = $control;
		}
		return $r;
	}

	/*
	 *
	 * Protected methods
	 */

	protected static function build_attribute($type, $default) {
		return [
			'type' => $type,
			'default' => $default,
		];
	}

	protected function get_single_of_config_arr_or_single(
		$config_key,
		$fallback = null,
		$get_last_if_array = false
	) {
		if (!array_key_exists($config_key, $this->config)) {
			return $fallback;
		}

		$config_val = $this->config[$config_key];
		if (!is_array($config_val)) {
			return $config_val;
		}

		if (!empty($config_val)) {
			return $config_val[$get_last_if_array ? count($config_val) - 1 : 0];
		}

		return $fallback;
	}

	/*
	 *
	 * Private methods
	 */
	private function set_block_uid() {
		$this->block_uid = self::build_attribute('string', '');
	}

	private function set_no_of_posts() {
		$this->no_of_posts = self::build_attribute(
			'integer',
			$this->get_single_of_config_arr_or_single('noOfPosts', -1, true)
		);
	}

	private function set_custom_controls() {
		$allowed_keys = ['customControls', 'postCustomControls'];
		$custom_controls = [];

		foreach ($allowed_keys as $key) {
			$custom_controls[$key] = $this->get_custom_controls($key);
		}

		if (empty($custom_controls)) {
			return;
		}

		$this->custom_controls = $custom_controls;

		error_log('$this->custom_controls: ' . print_r($this->custom_controls, true));
	}

	private function get_custom_controls($key) {
		if (!array_key_exists($key, $this->config)) {
			return [];
		}
		$custom_controls = [];
		foreach ($this->config[$key] as $control) {
			if (array_key_exists('choices', $control)) {
				$custom_controls[$control['id']] = self::build_attribute(
					'string',
					$control['choices'][0]['value']
				);
			} else {
				$custom_controls[$control['id']] = self::build_attribute(
					'string',
					''
				);
			}
		}

		return $custom_controls;
	}
}
