import LoginPage from "../pages/LoginPage";
import IOSProfilePage from "../pages/IOSProfilePage";
import getImage from "../helpers/getImage";
import {Action} from "tabris";

export default class extends Action {
  constructor(loginService) {
    super({
      id: "loginAction",
      title: "Login",
      placementPriority: "high"
    });
    this._loginService = loginService;
    this.on("select", () => {
      let self = this;
      let modeAction = {login: self._showLoginPage, loggedIn: self._showProfilePage};
      modeAction[this.get("mode")]();
    });
    this.on("change:mode", (widget, mode) => {
      this.set("title", {login: "Login", loggedIn: "Profile"}[mode]);
      let actionImage = getImage.forDevicePlatform("action_profile");
      this.set("image", {login: null, loggedIn: actionImage}[mode]);
    });
    this.on("logoutSuccess", () => this.set("mode", "login"));
    this.on("logoutFailure", () => this.set("mode", "loggedIn"));
    this.set("mode", this._loginService.isLoggedIn() ? "loggedIn" : "login");
    tabris.ui.on("change:activePage", this._maybeShow);
  }

  _showProfilePage() {
    new IOSProfilePage(this._loginService)
      .open()
      .set("data", this._loginService.getUserData());
  }

  _showLoginPage() {
    return new LoginPage(this._loginService)
      .open()
      .on("loginSuccess", () => this.set("mode", "loggedIn"));
  }

  _maybeShow(widget, page) {
    this.set("visible", page.get("topLevel"));
  }
}

