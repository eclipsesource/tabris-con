import config from "./configs/config";
import CodRemoteService from "./CodRemoteService";

export function create() {
  if (config.DATA_TYPE === "cod") {
    return new CodRemoteService(config.SERVICE_URL);
  }
}
