import LoginPage from "../pages/LoginPage";
import IOSProfilePage from "../pages/IOSProfilePage";
import * as loginService from "../helpers/loginService";
import getImage from "../helpers/getImage";
import {Action} from "tabris";

export default class extends Action {
  constructor() {
    super({
      id: "loginAction",
      title: "Login",
      placementPriority: "high"
    });
    this.on("select", () => {
      let modeAction = {login: showLoginPage, loggedIn: showProfilePage};
      modeAction[this.get("mode")](this);
    });
    this.on("change:mode", (widget, mode) => {
      this.set("title", {login: "Login", loggedIn: "Profile"}[mode]);
      let actionImage = getImage.forDevicePlatform("action_profile");
      this.set("image", {login: null, loggedIn: actionImage}[mode]);
    });
    this.on("logoutSuccess", () => this.set("mode", "login"));
    this.on("logoutFailure", () => this.set("mode", "loggedIn"));
    this.set("mode", loginService.isLoggedIn() ? "loggedIn" : "login");
    tabris.ui.on("change:activePage", maybeShowAction(this));
  }
}

function showLoginPage(action) {
  return new LoginPage()
    .open()
    .on("loginSuccess", () => action.set("mode", "loggedIn"));
}

function showProfilePage() {
  new IOSProfilePage()
    .open()
    .set("data", loginService.getUserData());
}

function maybeShowAction(action) {
  return function(widget, page) {
    action.set("visible", page.get("topLevel"));
  };
}
