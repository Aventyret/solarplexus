<?php

class Solarplexus_Block_Attrs_Definition {
  /*
   *
   * Public vars
   */
  public $no_of_posts;

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

    $this->set_no_of_posts();
  }

  public function to_array() {
    $r = [];
    $r['noOfPosts'] = $this->no_of_posts;
    return $r;
  }

  /*
   *
   * Protected methods 
   */

  protected static function build_attribute($type, $default) {
    return [
      'type' => $type,
      'default' => $default
    ];
  }

  protected function get_first_of_config_arr_or_single($config_key, $fallback = null) {
    if(!array_key_exists($config_key, $this->config)) {
      return $fallback;
    }
  
    $config_val = $this->config[$config_key];
    if(!is_array($config_val)) {
      return $config_val;
    }

    if(!empty($config_val)) {
      return $config_val[0];
    }
    
    return $fallback;
  }

  /*
   *
   * Private methods 
   */
  private function set_no_of_posts() {
    $this->no_of_posts = self::build_attribute(
      'integer',
      $this->get_first_of_config_arr_or_single('noOfPosts', -1)
    );
  }
}