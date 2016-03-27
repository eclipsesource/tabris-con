import ViewDataProvider from "./ViewDataProvider";
import ConferenceDataProvider from "./ConferenceDataProvider";
import AttendedBlockProvider from "./AttendedBlockProvider";
import InitialData from "./InitialData";
import ViewDataAdapter from "./ViewDataAdapter";
import * as NewDataFetcherFactory from "./NewDataFetcherFactory";

export function create(config) {
  let initialData = InitialData.createFor(config);
  let dataFetcher = NewDataFetcherFactory.create(config);
  let viewDataAdapter = new ViewDataAdapter(config);
  let conferenceDataProvider = new ConferenceDataProvider(dataFetcher, initialData);
  let attendedBlockProvider = new AttendedBlockProvider(conferenceDataProvider);
  return new ViewDataProvider(conferenceDataProvider, attendedBlockProvider, viewDataAdapter);
}
