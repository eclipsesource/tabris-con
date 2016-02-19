var Promise = require("promise");
var codRemoteService = require("./codRemoteService");

exports.login = function(username, password) {
  return codRemoteService
    .login(username, password)
    .then(function(response) {
      persistUserData(response);
      reloadScheduleItems();
      return Promise.resolve();
    })
    .then(function() {
      maybeTrigger("#loginPage", "loginSuccess");
    })
    .catch(function(e) {
      resetUserData();
      return Promise.reject(e);
    })
    .catch(function() {
      maybeTrigger("#loginPage", "loginFailure");
    });
};

exports.logout = function() {
  return codRemoteService.logout()
    .then(exports.destroySession)
    .catch(function() {
      triggerLogoutFailureEvents();
    });
};

exports.destroySession = function() {
  resetUserData();
  reloadScheduleItems();
  triggerLogoutSuccessEvents();
};

exports.isLoggedIn = function() {
  return !!localStorage.getItem("username");
};

exports.getUserData = function() {
  return {
    username: localStorage.getItem("username"),
    fullName: localStorage.getItem("fullName"),
    mail: localStorage.getItem("mail")
  };
};

function triggerLogoutSuccessEvents() {
  if (device.platform === "iOS") {
    maybeTrigger("#iOSProfilePage", "logoutSuccess");
    maybeTrigger("#loginAction", "logoutSuccess");
  } else {
    maybeTrigger("Drawer", "logoutSuccess");
  }
}

function triggerLogoutFailureEvents() {
  if (device.platform === "iOS") {
    maybeTrigger("#iOSProfilePage", "logoutFailure");
    maybeTrigger("#loginAction", "logoutFailure");
  } else {
    maybeTrigger("Drawer", "logoutFailure");
  }
}

function persistUserData(response) {
  localStorage.setItem("username", response.user.name);
  localStorage.setItem("fullName",
    response.user.field_profile_first.und[0].value +
    " " +
    response.user.field_profile_last.und[0].value
  );
  localStorage.setItem("mail", response.user.mail);
}

function resetUserData() {
  localStorage.setItem("username", "");
  localStorage.setItem("fullName", "");
  localStorage.setItem("mail", "");
}

function maybeTrigger(selector, event) {
  var widget = tabris.ui.find(selector).first();
  if (widget) {
    widget.trigger(event, widget);
  }
}

function reloadScheduleItems() {
  var schedule = tabris.ui.find("#schedule").first();
  if (schedule) {
    schedule.initializeItems();
  }
}
