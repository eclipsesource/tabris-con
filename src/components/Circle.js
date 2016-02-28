var _ = require("lodash");

exports.create = function(configuration) {
  var circleCanvas = tabris.create("Canvas", _.extend({
    width: configuration.radius * 2, height: configuration.radius * 2
  }, configuration));
  if (configuration.color) {
    drawCircle(circleCanvas);
  }
  circleCanvas.on("change:color", function() {
    drawCircle(circleCanvas);
  });
  return circleCanvas;
};

function drawCircle(canvas) {
  var radius = canvas.get("radius");
  var diameter = radius * 2;
  var ctx = canvas.getContext("2d", diameter, diameter);
  ctx.clearRect(0, 0, diameter, diameter);
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.fillStyle = canvas.get("color");
  ctx.fill();
}
