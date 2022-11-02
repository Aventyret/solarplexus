<?php
/**
 * Block attribute definitions that are only for handpicked blocks.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/includes/objects
 */
class Solarplexus_Handpicked_Block_Attrs_Definition extends
	Solarplexus_Block_Attrs_Definition
{
	public $search_results;

	public function __construct($block_config)
	{
		parent::__construct($block_config);

		$this->set_search_results();
	}

	public function to_array()
	{
		$common = parent::to_array();
		$r = [];
		$r['searchResults'] = $this->post_type;
		return array_merge($common, $r);
	}

	private function set_search_results()
	{
		$this->post_type = self::build_attribute('array', []);
	}
}
