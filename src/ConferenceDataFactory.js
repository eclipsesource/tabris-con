import * as DataExtractorFactory from "./DataExtractorFactory";
import CreateTabrisConPreviewCategories from "./CreateTabrisConPreviewCategories";
import FilterTabrisConCategories from "./FilterTabrisConCategories";

export function createFromRawData(config, data) {
  let dataExtractor = DataExtractorFactory.create(config, data);
  let extractedData = {
    sessions: dataExtractor.extractSessions(),
    blocks: dataExtractor.extractBlocks(),
    keynotes: dataExtractor.extractKeynotes()
  };
  return {
    sessions: extractedData.sessions,
    blocks: extractedData.blocks,
    keynotes: extractedData.keynotes,
    previewCategories:
      CreateTabrisConPreviewCategories.fromSessionsAndKeynotes(extractedData.sessions, extractedData.keynotes),
    categories: FilterTabrisConCategories.fromSessions(extractedData.sessions)
  };
}
