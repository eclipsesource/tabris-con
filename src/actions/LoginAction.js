import LoginPage from "../pages/LoginPage";
import IOSProfilePage from "../pages/IOSProfilePage";
import getImage from "../helpers/getImage";
import {Action} from "tabris";
import texts from "../resources/texts";

export default class extends Action {
  constructor(loginService) {
    super({
      id: "loginAction",
      title: texts.LOGIN_ACTION_TITLE,
      placementPriority: "high"
    });
    this._loginService = loginService;
    this.on("select", () => {
      let self = this;
      let modeAction = {login: self._showLoginPage, loggedIn: self._showProfilePage};
      modeAction[this.get("mode")].call(this);
    });
    this.on("change:mode", (widget, mode) => {
      this.set("title", {login: texts.LOGIN_ACTION_TITLE, loggedIn: texts.PROFILE_ACTION_TITLE}[mode]);
      let actionImage = getImage.forDevicePlatform("action_profile");
      this.set("image", {login: null, loggedIn: actionImage}[mode]);
    });
    this.set("mode", this._loginService.isLoggedIn() ? "loggedIn" : "login");
    let logoutHandler = () => this.set("mode", "login");
    let loggedInHandler = () => this.set("mode", "loggedIn");
    loginService
      .on("logoutSuccess", logoutHandler)
      .on("logoutError", loggedInHandler)
      .on("loginSuccess", loggedInHandler);
    this.on("dispose", () => {
      loginService.off("logoutSuccess", logoutHandler);
      loginService.off("logoutError", loggedInHandler);
      loginService.off("loginSuccess", loggedInHandler);
    });
    tabris.ui.on("change:activePage", (widget, page) => this._maybeShow(widget, page));
  }

  _showProfilePage() {
    new IOSProfilePage(this._loginService)
      .open()
      .set("data", this._loginService.getUserData());
  }

  _showLoginPage() {
    return new LoginPage(this._loginService)
      .open();
  }

  _maybeShow(widget, page) {
    this.set("visible", page.get("topLevel"));
  }
}

