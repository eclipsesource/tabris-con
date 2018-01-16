import _ from "lodash";

export default class FilterTabrisConCategories {
  static fromSessions(tabrisConSessions, options) {
    return _(tabrisConSessions)
      .groupBy(session => session.categoryId)
      .toPairs()
      .map(pair => _.zipObject(["id", "sessions"], pair))
      .filter(category => category.id !== "null")
      .map(category => Object.assign({}, category, {title: category.sessions[0].categoryName}))
      .map(category =>
        Object.assign({}, category, {
          sessions:
            _(category.sessions)
              .map(session => _.omit(session, ["nid", "room", "speakers"]))
              .slice(0, options && options.sessionLimit)
              .value()
        })
      )
      .value();
  }
}
