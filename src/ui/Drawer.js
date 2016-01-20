var colors = require("../../resources/colors");
var sizes = require("../../resources/sizes");
var DrawerUserArea = require("./DrawerUserArea");
var fontToString = require("../fontToString");

exports.create = function() {
  var accountModeEnabled = false;
  var drawer = tabris.create("Drawer");
  var scrollView = tabris.create("ScrollView", {
    left: 0, top: 0, right: 0, bottom: 0
  }).appendTo(drawer);

  DrawerUserArea.create().on("tap", toggleAccountMode).appendTo(scrollView);

  var drawerList = createDrawerList();
  var accountList = createAccountList();

  tabris.ui.on("change:activePage", function() {
    drawerList.children()
      .filter(function(child) {
        return child.get("page") instanceof tabris.Page;
      })
      .forEach(function(pageItem) {
        pageItem.updateSelection();
      });
  });

  function toggleAccountMode(userArea) {
    accountList.set("visible", !accountModeEnabled);
    drawerList.set("visible", accountModeEnabled);
    userArea.find("#menuArrowImageView").set("transform", !accountModeEnabled ? {rotation: Math.PI} : null);
    accountModeEnabled = !accountModeEnabled;
  }

  function createDrawerList() {
    var drawerList = tabris.create("Composite", {
      left: 0, top: ["#userArea", sizes.MARGIN], right: 0
    }).appendTo(scrollView);
    createPageListItem("My Schedule", "schedulePage").appendTo(drawerList);
    createPageListItem("Explore", "explorePage").appendTo(drawerList);
    createPageListItem("Map", "mapPage").appendTo(drawerList);
    createSeparator().appendTo(drawerList);
    createPageListItem("Settings", "settingsPage").appendTo(drawerList);
    return drawerList;
  }

  function createPageListItem(name, id) {
    var page = tabris.ui.find("#" + id).first();
    var pageListItem = createListItem(page.get("title"), page.get("image"));
    pageListItem.updateSelection = function() {
      pageListItem.find("#iconImageView").set("image", getPageImageVariant(page));
      pageListItem.set("background", pageIsActive(page) ? colors.LIGHT_BACKGROUND_COLOR : "transparent");
    };
    pageListItem.set("page", page)
      .on("tap", function() {
        if (tabris.ui.drawer) {
          tabris.ui.drawer.close();
        }
        page.open();
      });
    pageListItem.updateSelection();
    return pageListItem;
  }

  function createAccountList() {
    var accountList = tabris.create("Composite", {
      left: 0, top: ["#userArea", 8], right: 0,
      visible: false
    }).appendTo(scrollView);
    createListItem("Logout", {src: "resources/images/logout.png", scale: sizes.ICON_SCALE}).appendTo(accountList);
    return accountList;
  }

  function createSeparator() {
    var container = tabris.create("Composite", {
      left: 0,
      top: "prev()",
      right: 0,
      height: sizes.DRAWER_SEPARATOR_HEIGHT
    });
    tabris.create("Composite", {
      left: 0, right: 0, centerY: 0, height: 1,
      id: "separator",
      background: "#e8e8e8"
    }).appendTo(container);
    return container;
  }

  function createListItem(text, image) {
    var container = tabris.create("Composite", {
      left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
      highlightOnTouch: true
    });
    tabris.create("ImageView", {
      id: "iconImageView",
      image: image,
      left: sizes.MARGIN_BIG, centerY: 0
    }).appendTo(container);
    tabris.create("TextView", {
      id: "titleTextView",
      text: text,
      left: sizes.LEFT_CONTENT_MARGIN, centerY: 0,
      font: fontToString({
        weight: "bold",
        size: sizes.FONT_MEDIUM,
        family: device.platform === "iOS" ? ".HelveticaNeueInterface-Bold" : null
      }),
      textColor: colors.DRAWER_TEXT_COLOR
    }).appendTo(container);
    return container;
  }

  function getPageImageVariant(page) {
    var pageImage = page.get("image");
    if(pageIsActive(page)) {
      var imageSource = pageImage.src.replace(/.png$/, "_dark.png");
      pageImage.src = imageSource;
    }
    return pageImage;
  }

  function pageIsActive(page) {
    return tabris.ui.get("activePage").get("id") === page.get("id");
  }

};
