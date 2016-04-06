import Drawer from "./TabrisConDrawer";

export function createWith(navigatables, viewDataProvider, loginService, feedbackService) {
  navigatables.forEach(Navigatable => new Navigatable({viewDataProvider, loginService, feedbackService}).asPage());
  let navigation = new Drawer(loginService);
  navigation.open = function(id) {
    let page = tabris.ui.find(id + "Page").first();
    if (page) {
      page.open();
    }
  };
  return navigation;
}
