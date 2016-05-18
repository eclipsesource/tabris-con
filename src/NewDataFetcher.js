import timeoutFetch from "./timeoutFetch";
import maybeSet from "./helpers/maybeSet";
import {CouldNotFetchDataError} from "./errors";

let SUPPORTED_SERVICES = ["cod"];

let formatDataMappers = {
  cod: json => json ? {scheduledSessions: json} : null
};

export default class {
  constructor(config) {
    this._dataType = config.DATA_TYPE;
    this._apiUrl = config.SERVICE_URL;
    this._serviceNotImplemented = SUPPORTED_SERVICES.indexOf(config.DATA_TYPE) < 0;
    this.ETAG_LOCAL_STORAGE_KEY = this._dataType + "DataETag";
    this.LAST_MODIFIED_LOCAL_STORAGE_KEY = this._dataType + "DataLastModified";
    // Done to reflect non-standard caching implementation of Drupal.
    // For more information, see http://www.drupalcontrib.org/api/drupal/drupal!core!includes!bootstrap.inc/function/drupal_serve_page_from_cache/8
    this._drupalCacheWorkaround = this._dataType === "cod";
  }

  fetch() {
    if (this._serviceNotImplemented) {
      return Promise.resolve(null);
    }
    if (this._fetchPromise) {
      return this._fetchPromise;
    }
    this._fetchPromise = timeoutFetch(
      this._apiUrl,
      {method: "GET", headers: this._getFetchHeaders()}
    )
      .then(response => {
        if (response.status === 200) {
          this._storeCacheData(response);
          return response.json();
        }
        if (response.status === 304) {
          return null;
        }
        throw new CouldNotFetchDataError();
      })
      .then(formatDataMappers[this._dataType])
      .catch(() => {throw new CouldNotFetchDataError();})
      .finally(() => this._fetchPromise = null);
    return this._fetchPromise ;
  }

  _storeCacheData(response) {
    localStorage.setItem(this.ETAG_LOCAL_STORAGE_KEY, response.headers.get("ETag"));
    if (this._drupalCacheWorkaround) {
      localStorage.setItem(this.LAST_MODIFIED_LOCAL_STORAGE_KEY, response.headers.get("Last-Modified"));
    }
  }

  _getFetchHeaders() {
    let headers = {};
    maybeSet(headers, "If-None-Match", localStorage.getItem(this.ETAG_LOCAL_STORAGE_KEY));
    if (this._drupalCacheWorkaround) {
      maybeSet(headers, "If-Modified-Since", localStorage.getItem(this.LAST_MODIFIED_LOCAL_STORAGE_KEY));
    }
    return headers;
  }

}
