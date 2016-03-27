import colors from "../resources/colors";
import {Page, TabFolder} from "tabris";

export function createWith(navigatables, viewDataProvider) {
  let page = new Page({id: "mainPage", topLevel: true}).open();
  let navigation = new TabFolder({
    left: 0, top: 0, right: 0, bottom: 0,
    textColor: colors.TINT_COLOR,
    tabBarLocation: "bottom"
  });
  navigation.open = function(id) {
    setTimeout(() => { // TODO: tab open delayed as part of a workaround for tabris-ios#841
      let navigatable = navigation.find(id).first();
      if (navigatable) {
        navigatable.open();
      }
    }, 100);
  };
  createTabs(navigation, navigatables, viewDataProvider);
  updateTabFocusOnTabFolderSelectionChange(navigation, page);
  page.on("appear", triggerNavigatableAppear);
  navigation.appendTo(page);
  return navigation;
}

function updateTabFocusOnTabFolderSelectionChange(navigation, page) {
  navigation.on("change:selection", (navigation, tab) => {
    page.set("title", tab.get("title"));
    tab.get("navigatable").activate();
    navigation.children("Tab").forEach(tab => tab.set("image", tab.get("navigatable").get("image")));
  });
}

function createTabs(tabFolder, navigatables, viewDataProvider) {
  navigatables.forEach(Navigatable => {
    let navigatable = new Navigatable({viewDataProvider: viewDataProvider}).asTab();
    navigatable.parent().appendTo(tabFolder);
  });
}

function triggerNavigatableAppear() {
  this.find(".navigatable")
    .filter(navigatable => navigatable.get("active"))
    .forEach(navigatable => navigatable.trigger("appear"));
}
