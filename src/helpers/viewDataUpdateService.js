export function updateData(viewDataProvider) {
  viewDataProvider.invalidateCache();
  let schedule = tabris.ui.find("#schedule").first();
  let tracks = tabris.ui.find("#tracks").first();
  if (schedule) {
    schedule.set("indicatorsInitialized", false);
  }
  return Promise.all([
    schedule.initializeItems(),
    tracks.initializeItems()
  ]).catch(e => console.log(e));
}
