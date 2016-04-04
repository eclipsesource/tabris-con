import _ from "lodash";
import CreateTabrisConCategories from "./FilterTabrisConCategories";

export default class {
  static fromSessionsAndKeynotes(tabrisConSessions, tabrisConKeynotes) {
    return [
      {
        id: "KEYNOTES",
        title: "Keynotes",
        sessions: tabrisConKeynotes.map(keynote => _.omit(keynote, ["room", "speakers"]))
      },
      ...CreateTabrisConCategories.fromSessions(tabrisConSessions, {sessionLimit: 2})
    ];
  }
}
