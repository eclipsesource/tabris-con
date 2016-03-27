import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import getImage from "../helpers/getImage";
import addProgressTo from "../helpers/addProgressTo";
import * as loginService from "../helpers/loginService";
import LoginPage from "../pages/LoginPage";
import {Composite, ImageView, TextView} from "tabris";

export default class extends Composite {
  constructor() {
    super({
      left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
      highlightOnTouch: true,
      progress: false
    });

    let drawerIconImageView = new ImageView({
      class: "drawerIconImageView", image: getImage.forDevicePlatform("account"),
      centerY: 0
    }).appendTo(this);

    applyPlatformStyle(drawerIconImageView);

    let textViewContainer = new Composite({
      left: [".drawerIconImageView", sizes.MARGIN_XLARGE], top: 0, right: 0, bottom: 0
    }).appendTo(this);

    addProgressTo(this);

    let emailTextView = new TextView({
      font: fontToString({weight: "bold", size: sizes.FONT_SMALL}),
      textColor: "white",
      left: 0, top: sizes.MARGIN_SMALL
    }).appendTo(textViewContainer);

    let logoutTextView = new TextView({
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: "white",
      text: "Logout",
      left: 0, bottom: sizes.MARGIN_SMALL
    }).appendTo(textViewContainer);

    let loginTextView = new TextView({
      font: fontToString({weight: "bold", size: sizes.FONT_LARGE}),
      text: "Login",
      textColor: "white",
      left: 0, centerY: 0
    }).appendTo(textViewContainer);

    this.on("tap", () => {
      if (this.get("loggedIn")) {
        this.set("progress", true);
        loginService.logout().then(() => {
          this.set("progress", false);
          this.set("loggedIn", false);
        });
      } else {
        let loginPage = new LoginPage().open();
        loginPage.on("loginSuccess", () => this.set("loggedIn", true));
      }
    });

    this.on("change:loggedIn", (widget, loggedIn) => {
      if (loggedIn) {
        emailTextView.set({text: loginService.getUserData().mail});
      }
      emailTextView.set("visible", loggedIn);
      logoutTextView.set("visible", loggedIn);
      loginTextView.set("visible", !loggedIn);
    })
    .set("loggedIn", loginService.isLoggedIn());
  }
}
