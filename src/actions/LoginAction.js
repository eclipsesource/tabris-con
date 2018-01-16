import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import getImage from "../helpers/getImage";
import {Action} from "tabris";
import texts from "../resources/texts";
import {pageNavigation} from "../pages/navigation";

export default class LoginAction extends Action {
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
      modeAction[this.mode].call(this);
    });
    let logoutHandler = () => this.mode = "login";
    let loggedInHandler = () => this.mode = "loggedIn";
    loginService
      .onLogoutSuccess(logoutHandler)
      .onLogoutError(loggedInHandler)
      .onLoginSuccess(loggedInHandler);
    this.on("dispose", () => {
      loginService.offLogoutSuccess(logoutHandler);
      loginService.offLogoutError(loggedInHandler);
      loginService.offLoginSuccess(loggedInHandler);
    });
    this.mode = this._loginService.isLoggedIn() ? "loggedIn" : "login";
  }

  set mode(mode) {
    this._mode = mode;
    this.title = {login: texts.LOGIN_ACTION_TITLE, loggedIn: texts.PROFILE_ACTION_TITLE}[mode];
    let actionImage = getImage.forDevicePlatform("action_profile");
    this.image = {login: null, loggedIn: actionImage}[mode];
  }

  get mode() {
    return this._mode;
  }

  _showProfilePage() {
    new ProfilePage(this._loginService)
      .appendTo(pageNavigation)
      .data = this._loginService.getUserData();
  }

  _showLoginPage() {
    return new LoginPage(this._loginService)
      .on("loginSuccess", () => this.mode = "loggedIn")
      .appendTo(pageNavigation);
  }

}

