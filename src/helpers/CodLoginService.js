import {logError} from "../errors";

export default class LoginService {

  constructor(codRemoteService) {
    this._logoutSuccessHandlers = [];
    this._logoutErrorHandlers = [];
    this._loginErrorHandlers = [];
    this._loginSuccessHandlers = [];
    this._codRemoteService = codRemoteService;
    this._codRemoteService.setLoginService(this);
    this.onLogoutSuccess(() => {
      resetUserData();
      reloadScheduleItems();
    });
    this.onLoginError(() => resetUserData());
  }

  onLogoutSuccess(handler) {
    this._logoutSuccessHandlers.push(handler);
    return this;
  }

  onLogoutError(handler) {
    this._logoutErrorHandlers.push(handler);
    return this;
  }

  onLoginError(handler) {
    this._loginErrorHandlers.push(handler);
    return this;
  }

  onLoginSuccess(handler) {
    this._loginSuccessHandlers.push(handler);
    return this;
  }

  offLogoutSuccess(handler) {
    this._removeFromArray(this._logoutSuccessHandlers, handler);
    return this;
  }

  offLogoutError(handler) {
    this._removeFromArray(this._logoutErrorHandlers, handler);
    return this;
  }

  offLoginError(handler) {
    this._removeFromArray(this._loginErrorHandlers, handler);
    return this;
  }

  offLoginSuccess(handler) {
    this._removeFromArray(this._loginSuccessHandlers, handler);
    return this;
  }

  _removeFromArray(array, element) {
    let index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  triggerLogoutSuccess() {
    this._logoutSuccessHandlers.forEach(handler => handler());
  }

  triggerLogoutError() {
    this._logoutErrorHandlers.forEach(handler => handler());
  }

  triggerLoginError() {
    this._loginErrorHandlers.forEach(handler => handler());
  }

  triggerLoginSuccess() {
    this._loginSuccessHandlers.forEach(handler => handler());
  }

  login(username, password) {
    return this._codRemoteService
      .login(username, password)
      .then(response => {
        persistUserData(response);
        reloadScheduleItems();
        return Promise.resolve();
      })
      .then(() => this.triggerLoginSuccess())
      .catch(e => {
        resetUserData();
        this.triggerLoginError();
        logError(e);
        return Promise.reject(e);
      });
  }

  logout() {
    return this._codRemoteService.logout()
      .then(() => this.triggerLogoutSuccess())
      .catch(e => {
        this.triggerLogoutError();
        logError(e);
        return Promise.reject(e);
      });
  }

  destroySession() {
    this.triggerLogoutSuccess();
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
