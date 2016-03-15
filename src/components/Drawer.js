var sizes = require("../resources/sizes");
var AndroidDrawerUserArea = require("./AndroidDrawerUserArea");
var getImage = require("../helpers/getImage");
var loginService = require("../helpers/loginService");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var DrawerListItem = require("./DrawerListItem");
var DrawerPageListItem = require("./DrawerPageListItem");
var DrawerAccountListItem = require("./DrawerAccountListItem");

exports.create = function() {
  var accountModeEnabled = false;
  var drawer = tabris.create("Drawer", {
    accountMode: false,
    uwp_displayMode: "compactOverlay",
    uwp_theme: "dark",
    uwp_buttonBackground: "rgb(103,86,186)"
  });
  var drawerContainer = tabris.create(device.platform === "UWP" ? "Composite" : "ScrollView", {
    left: 0, top: 0, right: 0, bottom: 0
  }).appendTo(drawer);

  if (device.platform === "Android") {
    AndroidDrawerUserArea
      .create()
      .on("loggedInTap", function() {drawer.set("accountMode", !drawer.get("accountMode"));})
      .appendTo(drawerContainer);
  }

  var drawerList = createDrawerList().appendTo(drawerContainer);
  var accountList = createAccountList().appendTo(drawerContainer);

  tabris.ui.on("change:activePage", function() {
    drawerList.updateSelection();
    drawer.close();
  });

  drawer.on("change:accountMode", function(widget, value) {
    accountList.set("visible", value);
    drawerList.set("visible", !value);
    drawerContainer.children("#androidDrawerUserArea")
      .find("#menuArrowImageView").set("transform", value ? {rotation: Math.PI} : null);
    accountModeEnabled = value;
  });

  drawer.on("logoutSuccess", function() {
    drawerContainer.children("#androidDrawerUserArea").set("loggedIn", false);
    drawer.set("accountMode", false);
  });

  return drawer;
};

function createDrawerList() {
  var drawerList = tabris.create("Composite", {id: "drawerList", left: 0, right: 0, bottom: 0});
  drawerList.updateSelection = function() {
    drawerList.find()
    .filter(function(child) {
      return child.get("page") instanceof tabris.Page && child.get("page").get("topLevel");
    })
    .forEach(function(pageItem) {
      pageItem.updateSelection();
    });
  };
  applyPlatformStyle(drawerList);
  createPrimaryPageItems().appendTo(drawerList);
  createSecondaryPageItems().appendTo(drawerList);
  return drawerList;
}

function createPrimaryPageItems() {
  var pageItems = tabris.create("Composite", {left: 0, top: 0, right: 0});
  DrawerPageListItem.create("schedulePage").appendTo(pageItems);
  DrawerPageListItem.create("tracksPage").appendTo(pageItems);
  DrawerPageListItem.create("mapPage").appendTo(pageItems);
  return pageItems;
}

function createSecondaryPageItems() {
  var pageItems = tabris.create("Composite", {
    id: "drawerSecondaryPageItems",
    left: 0, right: 0
  });
  applyPlatformStyle(pageItems);
  createSeparator().appendTo(pageItems);
  if (device.platform === "UWP") {
    DrawerAccountListItem.create().appendTo(pageItems);
  }
  DrawerPageListItem.create("aboutPage").appendTo(pageItems);
  return pageItems;
}

function createAccountList() {
  var accountList = tabris.create("Composite", {
    left: 0, top: ["#androidDrawerUserArea", 8], right: 0,
    visible: false
  });
  DrawerListItem.create("Logout", getImage.forDevicePlatform("logout"))
  .on("tap", function(widget) {
    this.set("progress", true);
    loginService.logout().then(function() {widget.set("progress", false);});
  })
  .appendTo(accountList);
  return accountList;
}

function createSeparator() {
  var container = tabris.create("Composite", {
    left: 0,
    top: "prev()",
    right: 0,
    height: sizes.DRAWER_SEPARATOR_HEIGHT[device.platform]
  });
  tabris.create("Composite", {
    left: 0, right: 0, centerY: 0, height: 1,
    id: "separator",
    background: "#e8e8e8"
  }).appendTo(container);
  return container;
}
