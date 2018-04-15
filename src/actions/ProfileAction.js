import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import getImage from "../helpers/getImage";
import {Action} from "tabris";
import texts from "../resources/texts";
import {pageNavigation} from "../pages/navigation";

export default class ProfileAction extends Action {
  constructor(loginService) {
    super({
      id: "profileAction",
      title: texts.PROFILE_ACTION_TITLE,
      placementPriority: "high",
      image: getImage.forDevicePlatform("action_profile")
    });
    this._loginService = loginService;
    this.on("select", () => this._showProfilePage());
  }

  _showProfilePage() {
    new ProfilePage(this._loginService)
      .appendTo(pageNavigation)
      .data = this._loginService.getUserData();
  }

}

