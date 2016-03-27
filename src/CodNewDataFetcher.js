import timeoutFetch from "./timeoutFetch";
import URI from "urijs";
import maybeSet from "./helpers/maybeSet";
import {CouldNotFetchDataError} from "./errors";

export default class {
  constructor(config) {
    this._apiUrl = URI(config.SERVICE_URL).segment("api").segment("1.0").toString();
  }

  fetch() {
    let scheduledSessionsApiUrl = URI(this._apiUrl).segment("eclipsecon_scheduled_sessions").toString();
    return timeoutFetch(
      scheduledSessionsApiUrl,
      {method: "GET", headers: this._getFetchHeaders()}
    )
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem("codScheduledSessionsETag", response.headers.get("ETag"));
          localStorage.setItem("codScheduledSessionsLastModified", response.headers.get("Last-Modified"));
          return response.json();
        }
        if (response.status === 304) {
          return null;
        }
        throw new CouldNotFetchDataError();
      })
      .then(json => json ? {scheduledSessions: json} : null)
      .catch(() => {throw new CouldNotFetchDataError();});
  }

  _getFetchHeaders() {
    let headers = {};
    maybeSet(headers, "If-Modified-Since", localStorage.getItem("codScheduledSessionsLastModified"));
    maybeSet(headers, "If-None-Match", localStorage.getItem("codScheduledSessionsETag"));
    return headers;
  }
}
