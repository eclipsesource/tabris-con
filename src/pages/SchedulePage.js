exports.create = function() {
  return tabris.create("Page", {
    id: "schedulePage",
    topLevel: true,
    title: "My Schedule",
    image: {src: "resources/images/schedule.png", scale: 2}
  });
};
