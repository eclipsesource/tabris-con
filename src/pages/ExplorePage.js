exports.create = function() {
  return tabris.create("Page", {
    id: "explorePage",
    topLevel: true,
    title: "Explore",
    image: {src: "resources/images/explore.png", scale: 2}
  });
};
