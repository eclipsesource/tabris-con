import { resolve } from "tabris-decorators";
import ViewDataProvider from "../ViewDataProvider";

export function updateData() {
  resolve(ViewDataProvider).invalidateCache();
  let schedule = tabris.ui.find("#schedule").first();
  let tracks = tabris.ui.find("#tracks").first();
  if (schedule) {
    schedule.indicatorsInitialized = false;
  }
  return Promise.all([
    schedule.initializeItems(),
    tracks.initializeItems()
  ]).catch(e => console.log(e));
}
