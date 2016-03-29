import CodNewDataFetcher from "./CodNewDataFetcher";
import GoogleIONewDataFetcher from "./GoogleIONewDataFetcher";

export function create(config) {
  if (config.DATA_SOURCE === "codService") {
    return new CodNewDataFetcher(config);
  }
  if (config.DATA_SOURCE === "googleIOService") {
    return new GoogleIONewDataFetcher(config);
  }
  throw new Error("Unsupported data format.");
}

