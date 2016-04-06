import * as DataExtractorFactory from "./DataExtractorFactory";
import CreateTabrisConPreviewCategories from "./CreateTabrisConPreviewCategories";
import FilterTabrisConCategories from "./FilterTabrisConCategories";

export function createFromRawData(config, rawData) {
  let data;

  if (config.DATA_SOURCE !== "tabrisCon") {
    let dataExtractor = DataExtractorFactory.create(config, rawData);
    data = {
      sessions: dataExtractor.extractSessions(),
      blocks: dataExtractor.extractBlocks(),
      keynotes: dataExtractor.extractKeynotes()
    };
  } else {
    data = rawData;
  }

  return {
    sessions: data.sessions,
    blocks: data.blocks,
    keynotes: data.keynotes,
    previewCategories:
      CreateTabrisConPreviewCategories.fromSessionsAndKeynotes(data.sessions, data.keynotes),
    categories: FilterTabrisConCategories.fromSessions(data.sessions)
  };
}
