import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import getImage from "../helpers/getImage";
import {Action} from "tabris";
import texts from "../resources/texts";
import {pageNavigation} from "../pages/navigation";
import { resolve } from "tabris-decorators";
import LoginService from "../helpers/CodLoginService";

export default class ProfileAction extends Action {
  constructor() {
    super({
      id: "profileAction",
      title: texts.PROFILE_ACTION_TITLE,
      placementPriority: "high",
      image: getImage("action_profile")
    });
    this.on("select", () => this._showProfilePage());
  }

  _showProfilePage() {
    new ProfilePage()
      .appendTo(pageNavigation)
      .data = resolve(LoginService).getUserData();
  }

}

