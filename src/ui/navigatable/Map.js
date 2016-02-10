var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");

exports.create = function() {
  var map = Navigatable.create({
    id: "map",
    title: "Map",
    image: getImage.forDevicePlatform("map_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
    left: 0, top: 0, right: 0, bottom: 0,
    background: "#cdcbcc"
  });
  var imageSrc = tabris.app.getResourceLocation("resources/images/floorplan.png");
  var jQuerySrc = tabris.app.getResourceLocation("lib/jquery-2.2.0.min.js");
  var jQueryPanZoomSrc = tabris.app.getResourceLocation("lib/jquery.panzoom.min.js");
  tabris.create("WebView", {
    left: 0, top: 0, right: 0, bottom: 0,
    background: "#cdcbcc",
    html: "<html>" +
            "<head>" +
              "<style>body {background-color: #cdcbcc;}</style>" +
              "<script type='text/javascript' src='" + jQuerySrc + "'></script>" +
              "<script type='text/javascript' src='" + jQueryPanZoomSrc + "'></script>" +
            "</head>" +
            "<body>" +
              "<img src='" + imageSrc + "' />" +
              "<script>$(document).ready(function(){$('img').panzoom('fit': $('#fit'));});</script>" +
            "</body>" +
          "</html>"
  }).appendTo(map);
  return map;
};
