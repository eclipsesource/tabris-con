import fontToString from "../helpers/fontToString";
import ProgressButton from "../components/ProgressButton";
import {Page, Composite, TextView} from "tabris";
import texts from "../resources/texts";

export default class ProfilePage extends Page {

  constructor(loginService) {
    super({id: "profilePage", title: texts.PROFILE_PAGE_TITLE});
    let container = new Composite({
      width: 280, centerX: 0, top: 160
    }).appendTo(this);

    this._fullNameLabel = new TextView({
      left: 0, top: "prev()", right: 0,
      font: fontToString({size: 16, weight: "bold"})
    }).appendTo(container);

    this._mailLabel = new TextView({
      left: 0, top: "prev() 4", right: 0,
      font: fontToString({size: 16})
    }).appendTo(container);

    new ProgressButton({
      id: "logoutButton", text: texts.LOGOUT_BUTTON,
      top: "prev() 8", centerX: 0,
      font: fontToString({weight: "bold", size: 24})
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
