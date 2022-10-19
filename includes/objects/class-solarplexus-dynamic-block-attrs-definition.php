<?php
/**
 * Block attribute definitions that are only for dynamic blocks.
 *
 * @link       https://aventyret.com
 * @since      1.0.0
 *
 * @package    Solarplexus
 * @subpackage Solarplexus/includes/objects
 */
class Solarplexus_Dynamic_Block_Attrs_Definition extends Solarplexus_Block_Attrs_Definition {

  public $post_type;

  public $taxonomy; // NOTE: Legacy from before allowing multiple taxonomies

  public $terms; // NOTE: Legacy from before allowing multiple taxonomies

  public $taxonomy_terms;

  public $orderby;

  public $orderby_meta_key;

  public $order;

  public $authors;

  public $has_pagination;

  public $handpicked_posts;

  public function __construct($block_config) {
    parent::__construct($block_config);

    $this->set_post_type();
    $this->set_taxonomy(); // NOTE: Legacy from before allowing multiple taxonomies
    $this->set_terms(); // NOTE: Legacy from before allowing multiple taxonomies
    $this->set_taxonomy_terms();
    $this->set_orderby();
    $this->set_orderby_meta_key();
    $this->set_order();
    $this->set_authors();
    $this->set_has_pagination();
    $this->set_handpicked_posts();
  }

  public function to_array() {
    $common = parent::to_array();
    $r = [];
    $r['postType'] = $this->post_type;
    $r['taxonomy'] = $this->taxonomy; // NOTE: Legacy from before allowing multiple taxonomies
    $r['terms'] = $this->terms; // NOTE: Legacy from before allowing multiple taxonomies
    $r['taxonomyTerms'] = $this->taxonomy_terms;
    $r['orderby'] = $this->orderby;
    $r['orderbyMetaKey'] = $this->orderby_meta_key;
    $r['order'] = $this->order;
    $r['authors'] = $this->authors;
    $r['hasPagination'] = $this->has_pagination;
    $r['handpickedPosts'] = $this->handpicked_posts;
    return array_merge($common, $r);
  }

  private function set_post_type() {
    $this->post_type = self::build_attribute(
      'string',
      $this->get_first_of_config_arr_or_single('allowedPostTypes', 'post')
    );
  }
  // NOTE: Legacy from before allowing multiple taxonomies
  private function set_taxonomy() {
    $this->taxonomy = self::build_attribute(
      'string',
      ''
    );
  }
  // NOTE: Legacy from before allowing multiple taxonomies
  private function set_terms() {
    $this->taxonomy_terms = self::build_attribute(
      'array',
      []
    );
  }
  // Format: [[ 'slug' => 'taxonomy slug', 'terms' => [1, 2] ]]
  private function set_taxonomy_terms() {
    $this->terms = self::build_attribute(
      'array',
      []
    );
  }
  private function set_orderby() {
    $this->orderby = self::build_attribute(
      'string',
      'date'
    );
  }
  private function set_orderby_meta_key() {
    $this->orderby_meta_key = self::build_attribute(
      'string',
      ''
    );
  }
  private function set_order() {
    $this->order = self::build_attribute(
      'string',
      'desc'
    );
  }
  private function set_authors() {
    $this->authors = self::build_attribute(
      'array',
      []
    );
  }
  private function set_has_pagination() {
    $this->has_pagination = self::build_attribute(
      'boolean',
      false
    );
  }
  private function set_handpicked_posts() {
    $this->handpicked_posts = self::build_attribute(
      'array',
      []
    );
  }
}
