import colors from "../resources/colors";
import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import LoginPage from "../pages/LoginPage";
import getImage from "../helpers/getImage";
import {Composite, ImageView, TextView} from "tabris";
import config from "../configs/config";
import texts from "../resources/texts";

export default class extends Composite {
  constructor(loginService) {
    super({
      id: "androidDrawerUserArea",
      layoutData: {left: 0, top: 0, right: 0, height: sizes.DRAWER_USER_AREA_DEFAULT_HEIGHT},
      background: colors.BACKGROUND_COLOR
    });
    this._loginService = loginService;

    let mainContainer = new Composite({
      left: 0, top: 0, right: 0, bottom: 0
    }).appendTo(this);

    new ImageView({
      image: getImage.forDevicePlatform("drawer_background"),
      left: 0, top: 0, right: 0, bottom: 0,
      scaleMode: "fill"
    }).appendTo(mainContainer);

    if (config.SUPPORTS_FEEDBACK) {
      let loggedOutContainer = new Composite({
        highlightOnTouch: true,
        left: sizes.MARGIN_LARGE,
        bottom: 0,
        right: sizes.MARGIN_LARGE,
        height: sizes.DRAWER_USER_AREA_LOGGED_OUT_HEIGHT
      }).on("tap", () => {
        let loginPage = new LoginPage(this._loginService).open();
        loginPage.on("loginSuccess", () => this.set("loggedIn", true));
      }).appendTo(this);

      let accountImage = new ImageView({
        left: sizes.MARGIN_XSMALL, centerY: 0,
        image: getImage.forDevicePlatform("account")
      }).appendTo(loggedOutContainer);

      new TextView({
        text: texts.LOGIN_BUTTON.toUpperCase(),
        textColor: "white",
        font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
        left: [accountImage, sizes.MARGIN_LARGE], centerY: 0
      }).appendTo(loggedOutContainer);

      let userTextContainer = new Composite({
        left: sizes.MARGIN_LARGE,
        bottom: 0,
        right: sizes.MARGIN_LARGE,
        height: sizes.DRAWER_USER_TEXT_CONTAINER_HEIGHT
      }).appendTo(mainContainer);

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

      new ImageView({
        centerY: 0, right: 0,
        id: "menuArrowImageView",
        image: getImage.forDevicePlatform(`menu_down_${config.DRAWER_HEADER_THEME || "light"}_theme`)
      }).appendTo(userTextContainer);

      mainContainer.on("tap", () => this.trigger("loggedInTap", this));

      this
        .on("change:loggedIn", (widget, loggedIn) => {
          this.set("height",
            loggedIn ? sizes.DRAWER_USER_AREA_DEFAULT_HEIGHT : sizes.DRAWER_USER_AREA_LOGGED_OUT_HEIGHT);
          fullNameTextView.set("text", this._loginService.getUserData().fullName);
          mailTextView.set("text", this._loginService.getUserData().mail);
          mainContainer.set("visible", loggedIn);
          loggedOutContainer.set("visible", !loggedIn);
        })
        .set("loggedIn", this._loginService.isLoggedIn());
    }

  }
}

