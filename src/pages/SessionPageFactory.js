import OtherSessionsLink from "../components/OtherSessionsLink";
import SessionPage from "./SessionPage";

export function create(viewDataProvider) {
  let otherSessionsLink = new OtherSessionsLink(viewDataProvider);
  return new SessionPage(otherSessionsLink);
}
