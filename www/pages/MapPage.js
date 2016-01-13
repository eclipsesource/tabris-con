exports.create = function() {
  return tabris.create("Page", {
    id: "mapPage",
    topLevel: true,
    title: "Map",
    image: {src: "resources/images/map.png", scale: 2}
  });
};
