/* globals fetch: false, Promise: true*/
var getImage = require("../../getImage");
var colors = require("../../../resources/colors");
var Navigatable = require("./Navigatable");
var LoadingIndicator = require("../LoadingIndicator");
Promise = require("promise");
require("whatwg-fetch");

exports.create = function() {
  var map = Navigatable.create({
    id: "map",
    title: "Map",
    image: getImage.forDevicePlatform("map_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
    left: 0, top: 0, right: 0, bottom: 0
  });
  var loadingIndicator = LoadingIndicator.create().appendTo(map);
  map.once("appear", function() {
    if (device.platform === "Android") {
      createWebViewMapContainer(map)
        .set("html", getWebviewHtml(getBundledMapResource()))
        .on("load", showWebView);
    } else {
      internetConnectionAvailable()
        .then(function() {
          createWebViewMapContainer(map)
            .set("html", getWebviewHtml(getRemoteMapResource()))
            .on("load", showWebView);
        })
        .catch(function() {
          createImageViewMapContainer(map);
          loadingIndicator.dispose();
        });
    }
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
    background: "#cdcbcc"
  }).appendTo(map);
}

function createImageViewMapContainer(map) {
  tabris.create("ImageView", {
    left: 0, top: 0, right: 0, bottom: 0,
    image: "resources/images/floorplan.png"
  }).appendTo(map);
}

function getWebviewHtml(mapResource) {
  return "<html>" +
    "<head>" +
      "<style>body {background-color: #cdcbcc;}</style>" +
      "<script type='text/javascript' src='" + mapResource.jQuery + "'></script>" +
      "<script type='text/javascript' src='" + mapResource.jQueryPanZoom + "'></script>" +
    "</head>" +
    "<body>" +
      "<img src='" + mapResource.image + "' />" +
      "<script>$(document).ready(function(){$('img').panzoom('fit': $('#fit'));});</script>" +
    "</body>" +
  "</html>";
}

function getBundledMapResource() {
  return {
    image: tabris.app.getResourceLocation("resources/images/floorplan.png"),
    jQuery: tabris.app.getResourceLocation("lib/jquery-2.2.0.min.js"),
    jQueryPanZoom: tabris.app.getResourceLocation("lib/jquery.panzoom.min.js")
  };
}

function getRemoteMapResource() {
  return {
    image: "http://download.eclipsesource.com/~cpetrov/floorplan.jpg",
    jQuery: "https://code.jquery.com/jquery-2.2.0.min.js",
    jQueryPanZoom: "https://raw.githubusercontent.com/timmywil/jquery.panzoom/master/dist/jquery.panzoom.min.js"
  };
}

function internetConnectionAvailable() {
  return timeout(3000, fetch(getRemoteMapResource().image, {method: "HEAD"}));
}

function timeout(milliseconds, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"));
    }, milliseconds);
    promise.then(resolve, reject);
  });
}
