import ViewDataProvider from "./ViewDataProvider";
import ConferenceDataProvider from "./ConferenceDataProvider";
import AttendedBlockProvider from "./AttendedBlockProvider";
import BundledConferenceData from "./BundledConferenceData";
import ViewDataAdapter from "./ViewDataAdapter";
import NewDataFetcher from "./NewDataFetcher";

export function create(config, remoteService, loginService, feedbackService) {
  let bundledConferenceData = BundledConferenceData.create(config);
  let viewDataAdapter = new ViewDataAdapter(config, loginService, feedbackService);
  let conferenceDataProvider = new ConferenceDataProvider(bundledConferenceData);
  if (config.SERVICES && config.SERVICES.SESSIONS) {
    conferenceDataProvider.setNewDataFetcher(new NewDataFetcher(config));
  }
  let attendedBlockProvider = new AttendedBlockProvider(conferenceDataProvider);
  return new ViewDataProvider({
    config, conferenceDataProvider, attendedBlockProvider, viewDataAdapter, remoteService, loginService, feedbackService
  });
}
