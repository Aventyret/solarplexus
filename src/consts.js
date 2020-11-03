const { __ } = wp.i18n;

import {
  flipHorizontal,
  flipVertical,
  stretchWide,
  chevronUp,
  chevronLeft,
} from "@wordpress/icons";

export const LAYOUTS = {
  horizontal: { label: __("Horizontal", "splx"), icon: flipHorizontal },
  vertical: { label: __("Vertical", "splx"), icon: flipVertical },
};

// TODO better icons
export const ITEM_LAYOUTS = {
  imagebg: { label: __("Image as background", "splx"), icon: stretchWide },
  imagetop: { label: __("Image on top", "splx"), icon: chevronUp },
  imageleft: { label: __("Image to the left", "splx"), icon: chevronLeft },
};

export const ORDERS = {
  asc: __("Ascending", "splx"),
  desc: __("Descending", "splx"),
};
