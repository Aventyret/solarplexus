<?php

class Ruled_display_block_Helpers {
  public static function retrieve_block_config() {

    $config_path = RDB_PLUGIN_PATH . 'blockconfig.json';   
    $json = file_get_contents( $config_path );
    $config_data = json_decode( $json, true );

    // TODO allow override from theme

    return $config_data;
  }
}