import _ from "lodash";

export default function(target, predicate, aggregation) {
  let groups = _(target)
    .groupBy(predicate)
    .each(aggregate);
  return _.values(groups);

  function aggregate(value, key, object) {
    let val = _(value)
      .map(object => object[aggregation.aggregatee])
      .uniq()
      .join(aggregation.separator);
    let uniqueItem = _.uniqBy(value, predicate)[0];
    uniqueItem[aggregation.aggregatee] = val;
    object[key] = uniqueItem;
  }
}
