import CodNewDataFetcher from "./CodNewDataFetcher";
import GoogleIONewDataFetcher from "./GoogleIONewDataFetcher";

export function create(config) {
  if (config.DATA_FORMAT === "cod") {
    return new CodNewDataFetcher(config);
  }
  if (config.DATA_FORMAT === "googleIO") {
    return new GoogleIONewDataFetcher(config);
  }
  throw new Error("Unsupported data format.");
}

