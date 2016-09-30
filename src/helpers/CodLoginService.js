import {logError} from "../errors";

export default class LoginService {
  constructor(codRemoteService) {
    this._codRemoteService = codRemoteService;
    this._codRemoteService.setLoginService(this);
    this.on("logoutSuccess", () => {
      resetUserData();
      reloadScheduleItems();
    });
    this.on("loginError", () => resetUserData());
  }

  login(username, password) {
    return this._codRemoteService
      .login(username, password)
      .then(response => {
        persistUserData(response);
        reloadScheduleItems();
        return Promise.resolve();
      })
      .then(() => this.trigger("loginSuccess"))
      .catch(e => {
        resetUserData();
        this.trigger("loginError");
        logError(e);
        return Promise.reject(e);
      });
  }

  logout() {
    return this._codRemoteService.logout()
      .then(() => this.trigger("logoutSuccess"))
      .catch(e => {
        this.trigger("logoutError");
        logError(e);
        return Promise.reject(e);
      });
  }

  destroySession() {
    this.trigger("logoutSuccess");
  }

  isLoggedIn() {
    return !!localStorage.getItem("username");
  }

  getUserData() {
    return {
      username: localStorage.getItem("username"),
      fullName: localStorage.getItem("fullName"),
      mail: localStorage.getItem("mail")
    };
  }
}

Object.assign(LoginService.prototype, tabris.Events);

function persistUserData(response) {
  localStorage.setItem("username", response.user.name);
  localStorage.setItem("fullName",
    response.user.first_name +
    " " +
    response.user.last_name
  );
  localStorage.setItem("mail", response.user.mail);
}

function resetUserData() {
  localStorage.setItem("username", "");
  localStorage.setItem("fullName", "");
  localStorage.setItem("mail", "");
}

function reloadScheduleItems() {
  let schedule = tabris.ui.find("#schedule").first();
  if (schedule) {
    schedule.initializeItems();
  }
}
