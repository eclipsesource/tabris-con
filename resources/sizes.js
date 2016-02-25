var config = require("../config");

module.exports = {
  SUPPORTED_DEVICE_PIXEL_RATIOS: [1, 1.5, 2, 3],

  MARGIN_XXSMALL: 1,
  MARGIN_XSMALL: 2,
  MARGIN_SMALL: 4,
  MARGIN: 8,
  MARGIN_LARGE: 16,
  MARGIN_XLARGE: 32,
  LEFT_CONTENT_MARGIN: 72,

  FONT_SMALL: 12,
  FONT_MEDIUM: 14,
  FONT_LARGE: 16,
  FONT_XLARGE: 18,
  FONT_XXLARGE: 22,
  FONT_XXXLARGE: 24,

  SESSION_HEADER_ICON: 56,
  SESSION_SPEAKER_IMAGE: 38,
  SESSION_PAGE_SPACER_HEIGHT: 16,
  SESSION_PAGE_OTHER_SESSIONS_LINK_HEIGHT: 16,

  SESSION_CATEGORY_TITLE_CELL_HEIGHT: 48,
  SESSION_CELL_HEIGHT: {
    iOS: config.SESSIONS_HAVE_IMAGES ? 98 : 56,
    Android: config.SESSIONS_HAVE_IMAGES ? 98 : 72,
    UWP: config.SESSIONS_HAVE_IMAGES ? 98 : 72
  },
  PREVIEW_SESSION_CELL_HEIGHT: config.SESSIONS_HAVE_IMAGES ? 98 : 72,
  SESSION_CELL_IMAGE_HEIGHT: 84,
  SESSION_CELL_IMAGE_WIDTH: 112,

  CELL_TYPE_PREVIEW_CATEGORIES_SPACER_HEIGHT: 8,
  CELL_TYPE_SESSIONS_SPACER_HEIGHT: {
    Android: 8,
    UWP: 8,
    iOS: 0
  },
  CELL_TYPE_SEPARATOR_HEIGHT: {
    Android: 8,
    UWP: 8,
    iOS: 1
  },
  CELL_TYPE_SMALL_SEPARATOR_HEIGHT: 1,

  LOADING_INDICATOR: 48,
  LOADING_INDICATOR_LINE_WIDTH: 3.5,

  DRAWER_LIST_ITEM_HEIGHT: 48,
  DRAWER_SEPARATOR_HEIGHT: {
    Android: 16,
    UWP: 1
  },
  DRAWER_USER_TEXT_CONTAINER_HEIGHT: 56,
  DRAWER_USER_AREA_LOGGED_IN_HEIGHT: 160,
  DRAWER_USER_AREA_NOT_LOGGED_IN_HEIGHT: 84,

  SCHEDULE_PAGE_ITEM_HEIGHT: 120,

  INFO_TOAST_HEIGHT: 48,

  BLOCK_CIRCLE_RADIUS: 4,

  ATTRIBUTION_LIST_ROW_HEIGHT: 24,
  ABOUT_CONTENT_MIN_HEIGHT: 450,

  TRACK_CIRCLE_RADIUS: 12,
  TRACK_SQUARE_SIZE: 18,

  PAGE_CONTAINER_WIDTH: 280,
  PROFILE_AREA_TOP_OFFSET: 160,

  FEEDBACK_THUMB_SIZE: 36
};
