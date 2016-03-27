import CodDataExtractor from "./CodDataExtractor";
import GoogleIODataExtractor from "./GoogleIODataExtractor";

export function create(config, data) {
  if (config.DATA_FORMAT === "cod") {
    return new CodDataExtractor(data, config);
  }
  if (config.DATA_FORMAT === "googleIO") {
    return new GoogleIODataExtractor(data);
  }
  throw new Error("Unsupported data format.");
}

