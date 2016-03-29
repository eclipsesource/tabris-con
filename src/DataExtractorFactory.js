import CodDataExtractor from "./CodDataExtractor";
import GoogleIODataExtractor from "./GoogleIODataExtractor";

export function create(config, data) {
  if (config.DATA_SOURCE === "codService") {
    return new CodDataExtractor(data, config);
  }
  if (config.DATA_SOURCE === "googleIOService") {
    return new GoogleIODataExtractor(data);
  }
  throw new Error("Unsupported data format.");
}

