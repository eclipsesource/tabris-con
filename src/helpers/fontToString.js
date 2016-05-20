export default function(options) {
  return [
    options.style,
    options.weight,
    options.size && options.size + "px",
    options.family || (options.weight ? "sans-serif" : null) // TODO: workaround for eclipsesource/tabris-js#845
  ].filter(val => !!val).join(" ");
}
