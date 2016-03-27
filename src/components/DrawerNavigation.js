import Drawer from "./TabrisConDrawer";

export function createWith(navigatables, viewDataProvider) {
  navigatables.forEach(Navigatable => new Navigatable({viewDataProvider: viewDataProvider}).asPage());
  let navigation = new Drawer();
  navigation.open = function(id) {
    let page = tabris.ui.find(id + "Page").first();
    if (page) {
      page.open();
    }
  };
  return navigation;
}
