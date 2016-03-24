var colors = require("../resources/colors");

exports.createWith = function(navigatables) {
  var page = new tabris.Page({id: "mainPage", topLevel: true}).open();
  var navigation = new tabris.TabFolder({
    left: 0, top: 0, right: 0, bottom: 0,
    textColor: colors.TINT_COLOR,
    tabBarLocation: "bottom"
  });
  navigation.open = function(id) {
    setTimeout(function() { // TODO: tab open delayed as part of a workaround for tabris-ios#841
      var navigatable = navigation.find(id).first();
      if (navigatable) {
        navigatable.open();
      }
    }, 100);
  };
  createTabs(navigation, navigatables);
  updateTabFocusOnTabFolderSelectionChange(navigation, page);
  page.on("appear", triggerNavigatableAppear);
  navigation.appendTo(page);
  return navigation;
};

function updateTabFocusOnTabFolderSelectionChange(navigation, page) {
  navigation.on("change:selection", function(navigation, tab) {
    page.set("title", tab.get("title"));
    tab.get("navigatable").activate();
    navigation.children("Tab").forEach(function(tab) {
      tab.set("image", tab.get("navigatable").get("image"));
    });
  });
}

function createTabs(tabFolder, navigatables) {
  navigatables.forEach(function(Navigatable) {
    var navigatable = Navigatable.create().asTab();
    navigatable.parent().appendTo(tabFolder);
  });
}

function triggerNavigatableAppear() {
  this.find(".navigatable")
    .filter(function(navigatable) {return navigatable.get("active");})
    .forEach(function(navigatable) {
      navigatable.trigger("appear");
    });
}
