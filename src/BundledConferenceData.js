import _ from "lodash";
import * as ConferenceDataFactory from "./ConferenceDataFactory";

export default class BundledConferenceData {
  static create(config) {
    let initialRawData = _(config.BUNDLED_CONFERENCE_DATA)
      .transform((result, value, key) => result[key] = value, {})
      .value();
    return ConferenceDataFactory.createFromRawData(config, initialRawData);
  }
}
