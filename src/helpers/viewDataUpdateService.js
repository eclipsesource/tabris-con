export function updateData(viewDataProvider) {
  viewDataProvider.invalidateCache();
  let schedule = tabris.ui.find("#schedule").first();
  if (schedule) {
    schedule.set("indicatorsInitialized", false);
  }
  let promises = tabris.ui.find(".navigatable").toArray()
    .map(navigatable => navigatable.initializeItems());
  return Promise.all(promises).catch(e => console.log(e));
}
