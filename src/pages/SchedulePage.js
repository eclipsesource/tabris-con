var colors = require("../../resources/colors");
var sizes = require("../../resources/sizes");
var CollectionView = require("../ui/CollectionView");
var LoadingIndicator = require("../ui/LoadingIndicator");

exports.create = function() {
  var page = tabris.create("Page", {
    id: "schedulePage",
    topLevel: true,
    title: "My Schedule",
    image: {src: "resources/images/schedule.png", scale: sizes.ICON_SCALE}
  }).on("change:data", function(widget, adaptedBlocks) {
    if(page.children("TabFolder").length > 0) {
      return;
    }
    loadingIndicator.set("visible", false);
    var tabFolder = tabris.create("TabFolder", {
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      elevation: 4,
      tabBarLocation: "top",
      background: colors.BACKGROUND_COLOR,
      textColor: "white",
      paging: true
    }).appendTo(page);
    adaptedBlocks.forEach(function(blockObject) {
      var tab = createTab(blockObject.day).appendTo(tabFolder);
      CollectionView.create({
        left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
        items: blockObject.blocks
      }).appendTo(tab).animate({opacity: 1}, {duration: 250});
    });
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(page);

  function createTab(title) {
    return tabris.create("Tab", {title: title, background: "white"});
  }

  return page;
};
