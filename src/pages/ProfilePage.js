import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import ProgressButton from "../components/ProgressButton";
import {Page, Composite, TextView} from "tabris";
import texts from "../resources/texts";

export default class extends Page {
  constructor(loginService) {
    super({id: "profilePage", title: texts.PROFILE_PAGE_TITLE, topLevel: false});
    let container = new Composite({
      width: sizes.PAGE_CONTAINER_WIDTH, centerX: 0, top: sizes.PROFILE_AREA_TOP_OFFSET
    }).appendTo(this);

    let fullNameTextView = new TextView({
      left: 0, top: "prev()", right: 0,
      font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
    }).appendTo(container);

    let mailTextView = new TextView({
      left: 0, top: ["prev()", sizes.MARGIN_SMALL], right: 0,
      font: fontToString({size: sizes.FONT_LARGE})
    }).appendTo(container);

    new ProgressButton({
      id: "logoutButton", text: texts.LOGOUT_BUTTON,
      top: ["prev()", sizes.MARGIN], centerX: 0,
      font: fontToString({weight: "bold", size: sizes.FONT_XXXLARGE})
    }).on("select", progressButton => {
      progressButton.set("progress", true);
      loginService.logout();
    }).appendTo(container);

    this.on("change:data", (page, data) => {
      fullNameTextView.set("text", data.fullName);
      mailTextView.set("text", data.mail);
    });

    let logoutSuccessHandler = () => this.close();
    let logoutErrorHandler = () => this.find("#logoutButton").set("progress", false);

    loginService
      .on("logoutSuccess", logoutSuccessHandler)
      .on("logoutError", logoutErrorHandler);

    this.on("dispose", () => {
      loginService
        .off("logoutSuccess", logoutSuccessHandler)
        .off("logoutError", logoutErrorHandler);
    });
  }

}
