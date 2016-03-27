import {Canvas} from "tabris";

export default class extends Canvas {
  constructor(configuration) {
    super(
      Object.assign({}, configuration, {width: configuration.radius * 2, height: configuration.radius * 2})
    );
    if (configuration.color) {
      drawCircle(this);
    }
    this.on("change:color", () => drawCircle(this));
  }
}

function drawCircle(canvas) {
  let radius = canvas.get("radius");
  let diameter = radius * 2;
  let ctx = canvas.getContext("2d", diameter, diameter);
  ctx.clearRect(0, 0, diameter, diameter);
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.fillStyle = canvas.get("color");
  ctx.fill();
}
