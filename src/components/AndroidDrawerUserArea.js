import colors from "../resources/colors";
import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import LoginPage from "../pages/LoginPage";
import getImage from "../helpers/getImage";
import * as loginService from "../helpers/loginService";
import {Composite, ImageView, TextView} from "tabris";

export default class extends Composite {
  constructor() {
    super({
      id: "androidDrawerUserArea",
      layoutData: {left: 0, top: 0, right: 0, height: sizes.DRAWER_USER_AREA_LOGGED_IN_HEIGHT},
      background: colors.BACKGROUND_COLOR
    });

    let loggedOutContainer = new Composite({
      highlightOnTouch: true,
      left: sizes.MARGIN_LARGE,
      bottom: 0,
      right: sizes.MARGIN_LARGE,
      height: sizes.DRAWER_USER_AREA_NOT_LOGGED_IN_HEIGHT
    }).on("tap", () => {
      let loginPage = new LoginPage().open();
      loginPage.on("loginSuccess", () => this.set("loggedIn", true));
    }).appendTo(this);

    let accountImage = new ImageView({
      left: sizes.MARGIN_XSMALL, centerY: 0,
      image: getImage.forDevicePlatform("account")
    }).appendTo(loggedOutContainer);

    new TextView({
      text: "LOGIN",
      textColor: "white",
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      left: [accountImage, sizes.MARGIN_LARGE], centerY: 0
    }).appendTo(loggedOutContainer);

    let loggedInContainer = new Composite({
      left: 0, top: 0, right: 0, bottom: 0
    }).on("tap", () => this.trigger("loggedInTap", this)).appendTo(this);

    new ImageView({
      image: getImage.forDevicePlatform("drawer_background"),
      left: 0, top: 0, right: 0, bottom: 0,
      scaleMode: "fill"
    }).appendTo(loggedInContainer);

    let userTextContainer = new Composite({
      left: sizes.MARGIN_LARGE,
      bottom: 0,
      right: sizes.MARGIN_LARGE,
      height: sizes.DRAWER_USER_TEXT_CONTAINER_HEIGHT
    }).appendTo(loggedInContainer);

    let fullNameTextView = new TextView({
      top: sizes.MARGIN,
      textColor: "white",
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
    }).appendTo(userTextContainer);

    let mailTextView = new TextView({
      bottom: sizes.MARGIN,
      text: "jsmith@me.com",
      textColor: "white",
      font: fontToString({size: sizes.FONT_MEDIUM})
    }).appendTo(userTextContainer);

    new ImageView({
      centerY: 0, right: 0,
      id: "menuArrowImageView",
      image: getImage.forDevicePlatform("menu_down")
    }).appendTo(userTextContainer);

    this
      .on("change:loggedIn", (widget, loggedIn) => {
        this.set("height",
          loggedIn ? sizes.DRAWER_USER_AREA_LOGGED_IN_HEIGHT : sizes.DRAWER_USER_AREA_NOT_LOGGED_IN_HEIGHT);
        fullNameTextView.set("text", loginService.getUserData().fullName);
        mailTextView.set("text", loginService.getUserData().mail);
        loggedInContainer.set("visible", loggedIn);
        loggedOutContainer.set("visible", !loggedIn);
      })
      .set("loggedIn", loginService.isLoggedIn());
  }
}

