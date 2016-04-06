import config from "../configs/config";
import CodFeedbackService from "./CodFeedbackService";

export function create(remoteService) {
  if (config.DATA_SOURCE === "codService") {
    return new CodFeedbackService(remoteService);
  }
}
