<?php

class Ruled_display_block_Helpers {
  public static function retrieve_block_config() {

    $config_path = RDB_PLUGIN_PATH . 'rdb-config.json';

    $theme_config_path = get_stylesheet_directory() . '/rdb-config.json';

    // Override with custom config from theme
    if(file_exists($theme_config_path)) {
      $config_path = $theme_config_path;
    }
      
    $json = file_get_contents( $config_path );
    $config_data = json_decode( $json, true );

    return $config_data;
  }
}