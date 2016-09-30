import colors from "../resources/colors";
import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import {Composite, ImageView, TextView} from "tabris";
import config from "../configs/config";

const PROFILE_HEIGHT = 56;

export default class extends Composite {

  constructor(loginService) {
    super({
      id: "androidDrawerUserArea",
      left: 0, top: 0, right: 0, height: sizes.DRAWER_USER_AREA_HEIGHT,
      background: "white"
    });

    this._loginService = loginService;

    let drawerLogo = new ImageView({
      image: getImage.forDevicePlatform("drawer_logo"),
      left: 0, top: 0, right: 0, bottom: 0,
      scaleMode: "fit"
    }).appendTo(this);

    if (!config.SUPPORTS_FEEDBACK) {
      return;
    }

    let userTextContainer = new Composite({
      left: sizes.MARGIN_LARGE,
      bottom: 0,
      right: sizes.MARGIN_LARGE,
      height: PROFILE_HEIGHT
    }).appendTo(this);

    let fullNameTextView = new TextView({
      top: sizes.MARGIN,
      textColor: config.DRAWER_HEADER_THEME === "dark" ? "white" : colors.DARK_PRIMARY_TEXT_COLOR,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
    }).appendTo(userTextContainer);

    let mailTextView = new TextView({
      bottom: sizes.MARGIN,
      textColor: config.DRAWER_HEADER_THEME === "dark" ? "white" : colors.DARK_PRIMARY_TEXT_COLOR,
      font: fontToString({size: sizes.FONT_MEDIUM})
    }).appendTo(userTextContainer);

    this
      .on("change:loggedIn", (widget, loggedIn) => {
        fullNameTextView.set("text", this._loginService.getUserData().fullName || "");
        mailTextView.set("text", this._loginService.getUserData().mail || "");
        drawerLogo.set("bottom", loggedIn ? null : 0);
      })
      .set("loggedIn", this._loginService.isLoggedIn());
  }
}

