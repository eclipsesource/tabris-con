var _ = require("lodash");

module.exports = function(target, predicate, aggregation) {
  var groups = _(target)
    .groupBy(predicate)
    .each(aggregate);
  return _.values(groups);

  function aggregate(value, key, object) {
    var val = _(value)
      .map(function(object) {
        return object[aggregation.aggregatee];
      })
      .uniq()
      .join(aggregation.separator);
    var uniqueItem = _.uniqBy(value, predicate)[0];
    uniqueItem[aggregation.aggregatee] = val;
    object[key] = uniqueItem;
  }
};
