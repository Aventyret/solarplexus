<?php

class Solarplexus_Dynamic_Block_Attrs_Definition extends Solarplexus_Block_Attrs_Definition {

  public $post_type;

  public $taxonomy;

  public $terms;

  public $order;

  public function __construct($block_config) {
    parent::__construct($block_config);

    $this->set_post_type();
    $this->set_taxonomy();
    $this->set_terms();
    $this->set_order();
  }

  public function to_array() {
    $common = parent::to_array();
    $r = [];
    $r['postType'] = $this->post_type;
    $r['taxonomy'] = $this->taxonomy;
    $r['terms'] = $this->terms;
    $r['order'] = $this->order;
    return array_merge($common, $r);
  }

  private function set_post_type() {
    $this->post_type = self::build_attribute(
      'string',
      $this->get_first_of_config_arr_or_single('allowedPostTypes', 'post')
    );
  }
  private function set_taxonomy() {
    $this->taxonomy = self::build_attribute(
      'string',
      ''
    );
  }
  private function set_terms() {
    $this->terms = self::build_attribute(
      'array',
      []
    );
  }
  private function set_order() {
    $this->order = self::build_attribute(
      'string',
      'desc'
    );
  }

}