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
	public $hide_duplicates;

	public function __construct($block_config)
	{
		parent::__construct($block_config);

		$this->set_search_results();
		$this->set_hide_duplicates();
	}

	public function to_array()
	{
		$common = parent::to_array();
		$r = [];
		$r['searchResults'] = $this->search_results;
		$r['hideDuplicates'] = $this->hide_duplicates;
		return array_merge($common, $r);
	}

	private function set_search_results()
	{
		$this->search_results = self::build_attribute('array', []);
	}

	private function set_hide_duplicates()
	{
		$this->hide_duplicates = self::build_attribute('boolean', false);
	}
}
