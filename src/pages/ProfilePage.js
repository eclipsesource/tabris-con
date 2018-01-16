import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import ProgressButton from "../components/ProgressButton";
import {Page, Composite, TextView} from "tabris";
import texts from "../resources/texts";

export default class ProfilePage extends Page {

  constructor(loginService) {
    super({id: "profilePage", title: texts.PROFILE_PAGE_TITLE});
    let container = new Composite({
      width: sizes.PAGE_CONTAINER_WIDTH, centerX: 0, top: sizes.PROFILE_AREA_TOP_OFFSET
    }).appendTo(this);

    this._fullNameLabel = new TextView({
      left: 0, top: "prev()", right: 0,
      font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
    }).appendTo(container);

    this._mailLabel = new TextView({
      left: 0, top: ["prev()", sizes.MARGIN_SMALL], right: 0,
      font: fontToString({size: sizes.FONT_LARGE})
    }).appendTo(container);

    new ProgressButton({
      id: "logoutButton", text: texts.LOGOUT_BUTTON,
      top: ["prev()", sizes.MARGIN], centerX: 0,
      font: fontToString({weight: "bold", size: sizes.FONT_XXXLARGE})
    }).on("select", ({target}) => {
      target.showProgress(true);
      loginService.logout();
    }).appendTo(container);

    let logoutSuccessHandler = () => this.dispose();
    let logoutErrorHandler = () => this.find("#logoutButton").first().showProgress(false);

    loginService
      .onLogoutSuccess(logoutSuccessHandler)
      .onLogoutError(logoutErrorHandler);

    this.on("dispose", () => {
      loginService
        .offLogoutSuccess(logoutSuccessHandler)
        .offLogoutError(logoutErrorHandler);
    });
  }

  set data(data) {
    this._data = data;
    this._fullNameLabel.text = data.fullName;
    this._mailLabel.text = data.mail;
  }

  get data() {
    return this._data;
  }

}
