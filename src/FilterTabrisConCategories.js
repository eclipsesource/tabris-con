import _ from "lodash";

export default class {
  static fromSessions(tabrisConSessions) {
    return _(tabrisConSessions)
      .groupBy(session => session.categoryId)
      .toPairs()
      .map(pair => _.zipObject(["id", "sessions"], pair))
      .map(category => Object.assign({}, category, {title: category.sessions[0].categoryName}))
      .map(category =>
        Object.assign({}, category, {
          sessions: _(category.sessions).map(
            session => _.omit(session, ["description", "nid", "room", "speakers"])
          ).value()
        })
      )
      .value();
  }
}
