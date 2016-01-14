var colors = require("../../resources/colors.json");
var DrawerUserArea = require("./DrawerUserArea");

exports.create = function() {
  var accountModeEnabled = false;
  var drawer = tabris.create("Drawer");
  var scrollView = tabris.create("ScrollView", {
    left: 0, top: 0, right: 0, bottom: 0
  }).appendTo(drawer);

  DrawerUserArea.create().on("tap", toggleAccountMode).appendTo(scrollView);

  var drawerListItems = createDrawerListItems();
  var accountItems = createAccountItems();

  tabris.ui.on("change:activePage", function() {
    drawerListItems.children()
      .filter(function(child) {
        return child.get("item") instanceof tabris.Page;
      })
      .forEach(function(drawerPageItem) {
        drawerPageItem.find("#iconImageView").set("image", getPageItemImageVariant(drawerPageItem));
        drawerPageItem.set("background", getPageItemBackground(drawerPageItem));
      });
  });

  function toggleAccountMode(userArea) {
    accountItems.set("visible", !accountModeEnabled);
    drawerListItems.set("visible", accountModeEnabled);
    userArea.find("#menuArrowImageView").set("transform", !accountModeEnabled ? {rotation: Math.PI} : null);
    accountModeEnabled = !accountModeEnabled;
  }

  function createDrawerListItems() {
    var drawerListItems = tabris.create("Composite", {
      left: 0, top: "#userArea 8", right: 0
    }).appendTo(scrollView);
    createPageItem("My Schedule", "schedulePage").appendTo(drawerListItems);
    createPageItem("Explore", "explorePage").appendTo(drawerListItems);
    createPageItem("Map", "mapPage").appendTo(drawerListItems);
    createSeparator().appendTo(drawerListItems);
    createPageItem("Settings", "settingsPage").appendTo(drawerListItems);
    return drawerListItems;
  }

  function createPageItem(name, id) {
    var page = tabris.ui.find("#" + id).first();
    var itemComposite = createItem(page.get("title"), page.get("image"))
      .set({
        item: page,
        background: pageIsActive(page) ? "#e3e3e3" : "transparent"
      })
      .on("tap", function() {
        if (tabris.ui.drawer) {
          tabris.ui.drawer.close();
        }
        page.open();
      });
    return itemComposite;
  }

  function createAccountItems() {
    var accountItems = tabris.create("Composite", {
      left: 0, top: "#userArea 8", right: 0,
      visible: false
    }).appendTo(scrollView);
    createItem("Logout", {src: "resources/images/logout.png", scale: 2}).appendTo(accountItems);
    return accountItems;
  }

  function createSeparator() {
    var container = tabris.create("Composite", {left: 0, top: "prev()", right: 0, height: 17});
    tabris.create("Composite", {
      left: 0, right: 0, centerY: 0, height: 1,
      id: "separator",
      background: "#e8e8e8"
    }).appendTo(container);
    return container;
  }

  function createItem(text, image) {
    var container = tabris.create("Composite", {
      left: 0, top: "prev()", right: 0, height: 48,
      highlightOnTouch: true
    });
    tabris.create("ImageView", {
      id: "iconImageView",
      image: image,
      left: 16, centerY: 0
    }).appendTo(container);
    tabris.create("TextView", {
      id: "titleTextView",
      text: text,
      left: 72, centerY: 0,
      font: device.platform === "iOS" ? "bold 17px .HelveticaNeueInterface-Bold" : "bold 14px",
      textColor: colors.DARK_TEXT_COLOR
    }).appendTo(container);
    return container;
  }

  function getPageItemImageVariant(pageItem) {
    var page = pageItem.get("item");
    var pageImage = page.get("image");
    if(pageIsActive(page)) {
      var imageSource = pageImage.src.replace(/.png$/, "_dark.png");
      pageImage.src = imageSource;
    }
    return pageImage;
  }

  function getPageItemBackground(pageItem) {
    return pageIsActive(pageItem.get("item")) ? "#e3e3e3" : "transparent";
  }


  function pageIsActive(page) {
    return tabris.ui.get("activePage").get("id") === page.get("id");
  }

};
