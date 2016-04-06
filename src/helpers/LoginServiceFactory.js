import CodLoginService from "./CodLoginService";
import config from "../configs/config";

export function create(remoteService) {
  if (config.DATA_SOURCE === "codService") {
    return new CodLoginService(remoteService);
  }
}
