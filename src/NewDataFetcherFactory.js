import CodNewDataFetcher from "./CodNewDataFetcher";
import GoogleIONewDataFetcher from "./GoogleIONewDataFetcher";

export function create(config) {
  if (config.DATA_TYPE === "cod") {
    return new CodNewDataFetcher(config);
  }
  if (config.DATA_TYPE === "googleIO") {
    return new GoogleIONewDataFetcher(config);
  }
  throw new Error("Unsupported data format.");
}

