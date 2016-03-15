var Drawer = require("./Drawer");

exports.createWith = function(navigatables) {
  navigatables.forEach(function(Navigatable) {
    Navigatable.create().asPage();
  });
  var navigation = Drawer.create();
  navigation.open = function(id) {
    var page = tabris.ui.find(id + "Page").first();
    if (page) {
      page.open();
    }
  };
  return navigation;
};
