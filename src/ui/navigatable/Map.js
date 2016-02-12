var getImage = require("../../getImage");
var colors = require("../../../resources/colors");
var Navigatable = require("./Navigatable");
var LoadingIndicator = require("../LoadingIndicator");

exports.create = function() {
  var map = Navigatable.create({
    id: "map",
    title: "Map",
    image: getImage.forDevicePlatform("map_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
    left: 0, top: 0, right: 0, bottom: 0
  });
  LoadingIndicator.create().appendTo(map);
  map.once("appear", function() {
    createWebViewMapContainer(map).on("load", showWebView);
  });
  return map;
};

function showWebView(webView) {
  webView.set("visible", true);
  webView.parent().set("background", colors.MAP_BACKGROUND_COLOR);
  webView.parent().find("#loadingIndicator").dispose();
}

function createWebViewMapContainer(map) {
  return tabris.create("WebView", {
    left: 0, top: 0, right: 0, bottom: 0,
    visible: false,
    background: "#cdcbcc",
    url: tabris.app.getResourceLocation("resources/map.html")
  }).appendTo(map);
}
