import _ from "lodash";
import CreateTabrisConCategories from "./FilterTabrisConCategories";
import texts from "./resources/texts";

export default class CreateTabrisConPreviewCategories {
  static fromSessionsAndKeynotes(tabrisConSessions, tabrisConKeynotes) {
    return [
      {
        id: "KEYNOTES",
        title: texts.TRACKS_PAGE_KEYNOTES_TITLE,
        sessions: tabrisConKeynotes.map(keynote => _.omit(keynote, ["room", "speakers"]))
      },
      ...CreateTabrisConCategories.fromSessions(tabrisConSessions, {sessionLimit: 2})
    ];
  }
}
