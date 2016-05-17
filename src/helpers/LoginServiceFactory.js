import CodLoginService from "./CodLoginService";
import config from "../configs/config";

export function create(remoteService) {
  if (config.DATA_TYPE === "cod") {
    return new CodLoginService(remoteService);
  }
}
