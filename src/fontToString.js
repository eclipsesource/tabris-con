module.exports = function(options) {
  var font = [];
  maybePush(font, options.style);
  maybePush(font, options.weight);
  maybePush(font, options.size, "px");
  maybePush(font, options.family);
  return font.join(" ");
};

function maybePush(array, element, unit) {
  if(element) {
    array.push(element + (unit ? unit : ""));
  }
}