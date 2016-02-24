var DrawerListItem = require("./DrawerListItem");
var colors = require("../../resources/colors");

exports.create = function(id) {
  var page = tabris.ui.find("#" + id).first();
  var pageListItem = DrawerListItem.create(page.get("title"), page.get("image"));
  pageListItem.updateSelection = function() {
    pageListItem.find(".drawerIconImageView").set("image", page.find(".navigatable").get("image"));
    pageListItem.set("background", page.find(".navigatable").get("active") ?
      colors.DRAWER_LIST_ITEM_BACKGROUND[device.platform] : "transparent");
  };
  pageListItem.set("page", page);
  pageListItem.on("tap", function() {page.open();});
  return pageListItem;
};
