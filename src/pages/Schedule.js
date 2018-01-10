import CollectionView from "../components/collectionView/TabrisConCollectionView";
import LoadingIndicator from "../components/LoadingIndicator";
import getImage from "../helpers/getImage";
import {select} from "../helpers/platform";
import {logError} from "../errors";
import {TabFolder, Tab, TextView, Composite} from "tabris";
import _ from "lodash";
import texts from "../resources/texts";
import sizes from "../resources/sizes";
import colors from "../resources/colors";
import moment from "moment-timezone";

export default class ScheduleScreen extends Tab {

  constructor({viewDataProvider, loginService, feedbackService}) {
    super({
      id: "schedule",
      title: texts.MY_SCHEDULE_PAGE_TITLE,
      image: getImage.forDevicePlatform("schedule"),
      selectedImage: getImage.forDevicePlatform("schedule_selected")
    });

    this._loginService = loginService;
    this._feedbackService = feedbackService;
    this._viewDataProvider = viewDataProvider;

    this.loadingIndicator = new LoadingIndicator().appendTo(this);

    this.once("appear", () => {
      if (!this.data) {
        this.initializeItems();
      }
    });

    this.on("appear", () => {
      if (this.initializingItems) {
        this.once("initializingItemsChanged", maybeFocusItem);
      } else {
        maybeFocusItem(this);
      }
      this._updateFeedbackIndicators();
    });

    tabris.app.on("resume", () => this._updateFeedbackIndicators());
  }

  set data(data) {
    if (!this._data) {
      this.loadingIndicator.dispose();
      this._createUI(data);
    }
    this._data = data;
    let lastUpdated = localStorage.getItem("lastUpdated");
    this.find("#lastUpdated").first().text = `${texts.LAST_UPDATED} ${moment(lastUpdated).format("ll LT")}`;
    data.forEach(blockObject => {
      let collectionView = this.find("#" + blockObject.day).first();
      collectionView.items = blockObject.blocks;
    });
  }

  get data() {
    return this._data;
  }

  set focus(focus) {
    this._focus = focus;
    this.shouldFocusSessionWithId = focus;
  }

  get focus() {
    return this._focus;
  }

  set focusing(focusing) {
    this._focusing = focusing;
    this.trigger("focusingChanged", ({value: focusing}));
  }

  get focusing() {
    return this._focusing;
  }

  set initializingItems(value) {
    this._initializingItems = value;
    this.trigger("initializingItemsChanged");
  }

  get initializingItems() {
    return this._initializingItems;
  }

  _createUI(data) {
    let lastUpdatedBox = new Composite({
      left: 0, top: 0, right: 0, height: 32,
      background: select({
        android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
        default: "initial"
      })
    }).appendTo(this);
    new TextView({
      id: "lastUpdated",
      font: select({
        android: "italic bold 14px",
        default: "italic 12px sans-serif"
      }),
      opacity: select({android: 0.6, default: 1}),
      textColor: select({
        android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
        default: colors.DARK_SECONDARY_TEXT_COLOR
      }),
      centerX: select({
        ios: 0,
        default: null
      }),
      left: select({
        android: sizes.MARGIN_LARGE,
        windows: sizes.MARGIN + sizes.MARGIN_SMALL,
        ios: null
      }),
      top: select({
        android: 0,
        default: sizes.MARGIN + sizes.MARGIN_SMALL
      })
    }).appendTo(lastUpdatedBox);
    let tabFolder = new TabFolder({
      id: "scheduleTabFolder",
      left: 0, top: lastUpdatedBox, right: 0, bottom: 0,
      elevation: device.platform === "Android" ? 4 : 0,
      tabBarLocation: data.length <= 1 ? "hidden" : "top",
      textColor: select({
        ios: colors.IOS_ACTION_AREA_FOREGROUND_COLOR,
        android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
        windows: colors.WINDOWS_ACTION_AREA_FOREGROUND_COLOR,
        default: "initial"
      }),
      background: select({
        android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
        default: "initial"
      }),
      paging: true
    }).appendTo(this);
    this._createTabs(tabFolder, data);
  }

  getSessionIdTab(sessionId) {
    let index = _.findIndex(this.data, object => {
      return _.some(object.blocks, block => sessionId === block.sessionId);
    });
    return this.children("#scheduleTabFolder").children()[index];
  }

  initializeItems() {
    if (!this.initializingItems) {
      this.initializingItems = true;
      return this._viewDataProvider.getBlocks()
        .then(data => {
          this.data = data;
          this._initializeIndicators();
        })
        .catch(logError)
        .finally(() => {
          this.find(".scheduleDayList").first().refreshIndicator = false;
          this.loadingIndicator.dispose();
          this.initializingItems = false;
        });
    }
  }

  updateSessionWithId(id, property, value) {
    let collectionView = getItemCollectionView(this, id);
    if (collectionView) {
      let items = collectionView.items;
      let index = _.findIndex(items, {sessionId: id});
      items[index][property] = value;
      collectionView.refresh(index);
    }
  }

  findSessionById(sessionId) {
    let found;
    this.data.forEach((blockObject) => {
      blockObject.blocks.forEach(block => {
        if (block.sessionId === sessionId) {
          found = block;
        }
      });
    });
    return found;
  }

  _initializeIndicators() {
    if (!this.indicatorsInitialized && !this.evaluatedSessionId) {
      this._updateAllFeedbackIndicators();
      this.indicatorsInitialized = true;
    }
  }

  _updateFeedbackIndicators() {
    if (this.evaluatedSessionId) {
      this._updateEvaluatedSessionIndicator();
    } else {
      this._updateAllFeedbackIndicators();
    }
  }

  _updateEvaluatedSessionIndicator() {
    if (this.evaluatedSessionId) {
      this.updateSessionWithId(this.evaluatedSessionId, "feedbackIndicatorState", "sent");
      this.evaluatedSessionId = null;
    }
  }

  _updateAllFeedbackIndicators() {
    this._updateEvaluatedSessionIndicator();
    this._viewDataProvider.getSessionIdIndicatorStates()
      .then(idStates => {
        if (this.focusing) {
          this.once("focusingChanged", () => this._applyIdStates(idStates));
        } else {
          this._applyIdStates(idStates);
        }
      })
      .catch(logError);
  }

  _applyIdStates(idStates) {
    idStates.forEach(idState => this.updateSessionWithId(idState.id, "feedbackIndicatorState", idState.state));
  }

  _createTabs(tabFolder, data) {
    data.forEach(blockObject => {
      let tab = createTab(blockObject.day).appendTo(tabFolder);
      let collectionView = new CollectionView({
        left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
        id: blockObject.day,
        class: "scheduleDayList",
        items: blockObject.blocks,
        updatable: true,
        viewDataProvider: this._viewDataProvider,
        loginService: this._loginService,
        feedbackService: this._feedbackService
      }).appendTo(tab);
      collectionView.animate({opacity: 1}, {duration: 250});
    });
  }
}

function getItemCollectionView(schedule, sessionId) {
  let tab = schedule.getSessionIdTab(sessionId);
  return tab ? tab.find(".scheduleDayList").first() : null;
}

function maybeFocusItem(schedule) {
  let sessionId = schedule.shouldFocusSessionWithId;
  if (sessionId) {
    schedule.shouldFocusSessionWithId = null;
    schedule.focusing = true;
    let tab = schedule.getSessionIdTab(sessionId);
    if (tab) {
      schedule.children("#scheduleTabFolder").first().selection = tab;
      let collectionView = tab.children(".scheduleDayList").first();
      let collectionViewItems = collectionView.items;
      let index = _.findIndex(collectionViewItems, item => item.sessionId === sessionId);
      collectionView.items[index].shouldPop = true;
      if (collectionView.bounds.height === 0) { // TODO: workaround for reveal only working after resize on iOS
        collectionView.once("resize", () => {
          collectionView.reveal(index);
          collectionView.refresh(index);
          notFocusing(schedule);
        });
      } else {
        collectionView.reveal(index);
        collectionView.refresh(index);
        notFocusing(schedule);
      }
    }
  }
}

function notFocusing(schedule) {
  setTimeout(() => {
    schedule.focusing = false;
  }, 2000);
}

function createTab(title) {
  return new Tab({title: title, background: "white"});
}
