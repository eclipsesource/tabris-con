import { TabFolder, Tab, TextView, app, device } from "tabris";
import { findFirst, property } from "tabris-decorators";
import * as moment from "moment-timezone";
import * as _ from "lodash";
import TabrisConCollectionView from "../components/collectionView/TabrisConCollectionView";
import LoadingIndicator from "../components/LoadingIndicator";
import ViewDataProvider from "../ViewDataProvider";
import CodFeedbackService from "../helpers/CodFeedbackService";
import LoginService from "../helpers/CodLoginService";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import texts from "../resources/texts";
import sizes from "../resources/sizes";
import { select } from "../helpers/platform";
import { logError } from "../errors";

interface ServiceArgs {
  loginService: LoginService;
  feedbackService: CodFeedbackService;
  viewDataProvider: ViewDataProvider;
}

export default class Schedule extends Tab {

  public jsxProperties: JSX.TabProperties;

  @findFirst("#lastUpdated") public lastUpdatedView: TextView;
  @property public focusing: boolean = false;
  @property public initializingItems: boolean = false;

  private loginService: LoginService;
  private feedbackService: CodFeedbackService;
  private viewDataProvider: ViewDataProvider;
  private loadingIndicator: LoadingIndicator;

  private _data: any = null;
  private _focus: string = null;

  private shouldFocusSessionWithId: string = null;
  private indicatorsInitialized: boolean = false;
  private evaluatedSessionId: string = null;

  constructor(services: ServiceArgs) {
    super();
    this.initialize(services);
    this.registerEventHandlers();
  }

  set data(data: any) {
    if (this._data === null) {
      this.loadingIndicator.dispose();
      this.createUI(data);
    }
    this._data = data;
    let lastUpdated = localStorage.getItem("lastUpdated");
    this.lastUpdatedView.text = `${texts.LAST_UPDATED} ${moment(lastUpdated).format("ll LT")}`;
    data.forEach((blockObject: any) => {
      let collectionView = this.find("#" + blockObject.day).first() as TabrisConCollectionView;
      collectionView.items = blockObject.blocks;
    });
  }

  get data() {
    return this._data;
  }

  set focus(focus: string) {
    this._focus = focus;
    this.shouldFocusSessionWithId = focus;
  }

  get focus() {
    return this._focus;
  }

  private initialize({ viewDataProvider, loginService, feedbackService }: ServiceArgs) {
    this.set({
      id: "schedule",
      title: texts.MY_SCHEDULE_PAGE_TITLE,
      image: getImage.forDevicePlatform("schedule"),
      selectedImage: getImage.forDevicePlatform("schedule_selected")
    });
    this.loginService = loginService;
    this.feedbackService = feedbackService;
    this.viewDataProvider = viewDataProvider;
    this.loadingIndicator = new LoadingIndicator().appendTo(this);
  }

  private createUI(data: any) {
    this.append(
      <composite
        class="last-updated-box"
        left={0} top={0} right={0} height={32}
        background={select({
          android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
          default: "initial"
        })}>
        <textView
          id="lastUpdated"
          font={select({
            android: fontToString({ style: "italic", weight: "bold", size: sizes.FONT_MEDIUM }),
            default: fontToString({ style: "italic", size: sizes.FONT_SMALL, family: "sans-serif" })
          })}
          opacity={select({ android: 0.6, default: 1 })}
          textColor={select({
            android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
            default: colors.DARK_SECONDARY_TEXT_COLOR
          })}
          centerX={select({
            ios: 0,
            default: null
          })}
          left={select({
            android: sizes.MARGIN_LARGE,
            windows: sizes.MARGIN + sizes.MARGIN_SMALL,
            ios: null
          })}
          top={select({
            android: 0,
            default: sizes.MARGIN + sizes.MARGIN_SMALL
          })} />
        <tabFolder
          id="scheduleTabFolder"
          left={0} top=".last-updated-box" right={0} bottom={0}
          elevation={device.platform === "Android" ? 4 : 0}
          tabBarLocation={data.length <= 1 ? "hidden" : "top"}
          textColor={select({
            ios: colors.IOS_ACTION_AREA_FOREGROUND_COLOR,
            android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
            windows: colors.WINDOWS_ACTION_AREA_FOREGROUND_COLOR,
            default: "initial"
          })}
          background={select({
            android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
            default: "initial"
          })}
          paging={true} />
      </composite>
    );
    let tabFolder = this.find("#scheduleTabFolder").first() as TabFolder;
    this.createTabs(tabFolder, data);
  }

  private registerEventHandlers() {
    this.once("appear", () => {
      if (this.data === null) {
        this.initializeItems();
      }
    });
    this.on("appear", () => {
      if (!this.initializingItems) {
        this.once("initializingItemsChanged", () => this.maybeFocusItem());
      } else {
        this.maybeFocusItem();
      }
      this.updateFeedbackIndicators();
    });
    app.on("resume", () => this.updateFeedbackIndicators());
  }

  private getSessionIdTab(sessionId: string): Tab {
    let index = _.findIndex(this.data, (object: any) => {
      return _.some(object.blocks, block => sessionId === block.sessionId);
    });
    return this.children("#scheduleTabFolder").children()[index] as Tab;
  }

  private async initializeItems() {
    if (!this.initializingItems) {
      this.initializingItems = true;
      try {
        this.data = await this.viewDataProvider.getBlocks();
        this.initializeIndicators();
      }
      catch (ex) {
        logError(ex);
      }
      let scheduleDayList = this.find(".scheduleDayList").first() as TabrisConCollectionView;
      scheduleDayList.refreshIndicator = false;
      this.loadingIndicator.dispose();
      this.initializingItems = false;
    }
  }

  private updateSessionWithId(id: string, propertyName: string, value: string) {
    let collectionView = this.getItemCollectionView(id);
    if (collectionView) {
      let items = collectionView.items;
      let index = _.findIndex(items, { sessionId: id });
      items[index][propertyName] = value;
      collectionView.refresh(index);
    }
  }

  private initializeIndicators() {
    if (!this.indicatorsInitialized && this.evaluatedSessionId === null) {
      this.updateAllFeedbackIndicators();
      this.indicatorsInitialized = true;
    }
  }

  private updateFeedbackIndicators() {
    if (this.evaluatedSessionId === null) {
      this.updateAllFeedbackIndicators();
    } else {
      this.updateEvaluatedSessionIndicator();
    }
  }

  private updateEvaluatedSessionIndicator() {
    if (this.evaluatedSessionId !== null) {
      this.updateSessionWithId(this.evaluatedSessionId, "feedbackIndicatorState", "sent");
      this.evaluatedSessionId = null;
    }
  }

  private updateAllFeedbackIndicators() {
    this.updateEvaluatedSessionIndicator();
    this.viewDataProvider.getSessionIdIndicatorStates()
      .then((idStates: any) => {
        if (this.focusing) {
          this.once("focusingChanged", () => this.applyIdStates(idStates));
        } else {
          this.applyIdStates(idStates);
        }
      })
      .catch(logError);
  }

  private applyIdStates(idStates: any) {
    idStates.forEach((idState: any) => this.updateSessionWithId(idState.id, "feedbackIndicatorState", idState.state));
  }

  private createTabs(tabFolder: TabFolder, data: any) {
    data.forEach((blockObject: any) => {
      let tab = (
        <tab title={blockObject.day} background="white" />
      );
      tab.appendTo(tabFolder);
      let collectionView = new TabrisConCollectionView({
        left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
        id: blockObject.day,
        class: "scheduleDayList",
        items: blockObject.blocks,
        updatable: true,
        viewDataProvider: this.viewDataProvider,
        loginService: this.loginService,
        feedbackService: this.feedbackService
      }).appendTo(tab);
      collectionView.animate({ opacity: 1 }, { duration: 250 });
    });
  }

  private getItemCollectionView(sessionId: string): TabrisConCollectionView {
    let tab = this.getSessionIdTab(sessionId);
    return tab ? tab.find(".scheduleDayList").first() as TabrisConCollectionView : null;
  }

  private maybeFocusItem() {
    let sessionId = this.shouldFocusSessionWithId;
    if (sessionId) {
      this.shouldFocusSessionWithId = null;
      this.focusing = true;
      let tab = this.getSessionIdTab(sessionId);
      if (tab) {
        let tabFolder = this.find("#scheduleTabFolder").first() as TabFolder;
        tabFolder.selection = tab;
        let collectionView = tab.children(".scheduleDayList").first() as TabrisConCollectionView;
        let collectionViewItems = collectionView.items;
        let index = _.findIndex(collectionViewItems, (item: any) => item.sessionId === sessionId);
        collectionView.items[index].shouldPop = true;
        if (collectionView.bounds.height === 0) { // TODO: workaround for reveal only working after resize on iOS
          collectionView.once("resize", () => {
            collectionView.reveal(index);
            collectionView.refresh(index);
            this.notFocusing();
          });
        } else {
          collectionView.reveal(index);
          collectionView.refresh(index);
          this.notFocusing();
        }
      }
    }
  }

  private notFocusing() {
    setTimeout(() => {
      this.focusing = false;
    }, 2000);
  }

}
