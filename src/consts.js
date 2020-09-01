const { __ } = wp.i18n;

import {
  flipHorizontal,
  flipVertical,
  arrowRight,
  stretchWide,
  chevronUp,
  chevronLeft,
} from "@wordpress/icons";

// TODO better carousel icon
export const LAYOUTS = {
  horizontal: { label: __("Horizontal", "rdb"), icon: flipHorizontal },
  vertical: { label: __("Vertical", "rdb"), icon: flipVertical },
  carousel: { label: __("Carousel", "rdb"), icon: arrowRight },
};

// TODO better icons
export const ITEM_LAYOUTS = {
  imagebg: { label: __("Image as background", "rdb"), icon: stretchWide },
  imagetop: { label: __("Image on top", "rdb"), icon: chevronUp },
  imageleft: { label: __("Image to the left", "rdb"), icon: chevronLeft },
};

export const ORDERS = {
  asc: __("Ascending", "rdb"),
  desc: __("Descending", "rdb"),
};
