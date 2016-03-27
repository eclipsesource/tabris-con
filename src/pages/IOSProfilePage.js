import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import ProgressButton from "../components/ProgressButton";
import * as loginService from "../helpers/loginService";
import {Page, Composite, TextView} from "tabris";

export default class extends Page {
  constructor() {
    super({id: "iOSProfilePage", title: "Profile", topLevel: false});
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

    let progressButton = new ProgressButton({
      id: "logoutButton", text: "Logout",
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

    this.on("logoutSuccess", () => this.close());
    this.on("logoutFailure", () => progressButton.set("progress", false));
  }
}
