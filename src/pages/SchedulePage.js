var colors = require("../../resources/colors");
var CollectionView = require("../ui/CollectionView");
var LoadingIndicator = require("../ui/LoadingIndicator");
var getImage = require("../getImage");

exports.create = function() {
  var page = tabris.create("Page", {
    id: "schedulePage",
    topLevel: true,
    title: "My Schedule",
    image: getImage("schedule")
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(page);

  page.on("change:data", function(widget, adaptedBlocks) {
    if (page.children("#scheduleTabFolder").length > 0 && !page.children("#scheduleTabFolder").first().isDisposed()) {
      page.children("#scheduleTabFolder").children().dispose();
      populateTabFolder(page.children("#scheduleTabFolder").first(), adaptedBlocks);
      return;
    }
    loadingIndicator.dispose();
    var tabFolder = tabris.create("TabFolder", {
      id: "scheduleTabFolder",
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      elevation: 4,
      tabBarLocation: "top",
      background: colors.BACKGROUND_COLOR,
      textColor: "white",
      paging: true
    }).appendTo(page);
    populateTabFolder(tabFolder, adaptedBlocks);
  });

  return page;
};

function populateTabFolder(tabFolder, adaptedBlocks) {
  adaptedBlocks.forEach(function(blockObject) {
    var tab = createTab(blockObject.day).appendTo(tabFolder);
    CollectionView.create({
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      items: blockObject.blocks
    }).appendTo(tab).animate({opacity: 1}, {duration: 250});
  });
}

function createTab(title) {
  return tabris.create("Tab", {title: title, background: "white"});
}
