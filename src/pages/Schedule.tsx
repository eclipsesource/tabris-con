import { TabFolder, Tab, TextView, app, device, ActivityIndicator, TabProperties } from "tabris";
import { property, getById } from "tabris-decorators";
import * as moment from "moment-timezone";
import TabrisConCollectionView from "../components/collectionView/TabrisConCollectionView";
import ViewDataProvider from "../ViewDataProvider";
import CodFeedbackService from "../helpers/CodFeedbackService";
import LoginService from "../helpers/CodLoginService";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import texts from "../resources/texts";
import { select } from "../helpers/platform";
import { logError } from "../errors";

interface ScheduleProperties {
  loginService: LoginService;
  feedbackService: CodFeedbackService;
  viewDataProvider: ViewDataProvider;
}

export default class Schedule extends Tab {

  public jsxProperties: JSX.TabProperties & ScheduleProperties;
  public tsProperties: TabProperties & ScheduleProperties;

  @property public loginService: LoginService;
  @property public feedbackService: CodFeedbackService;
  @property public viewDataProvider: ViewDataProvider;
  @property public initializingItems: boolean = false;
  @getById private activityIndicator: ActivityIndicator;
  private highlightId: any;
  private _data: any = null;

  constructor(properties: ScheduleProperties) {
    super();
    this.set({
      id: "schedule",
      title: texts.MY_SCHEDULE_PAGE_TITLE,
      image: getImage.forDevicePlatform("schedule"),
      selectedImage: getImage.forDevicePlatform("schedule_selected"),
      ...properties
    });
    this.append(
      <activityIndicator
          id="activityIndicator"
          centerX={0} centerY={0} />
    );
    this.registerEventHandlers();
  }

  set data(data: any) {
    if (this._data === null) {
      this.activityIndicator.dispose();
      this.createUI(data);
    }
    this._data = data;
    let lastUpdated = localStorage.getItem("lastUpdated");
    let lastUpdatedLabel = this.find("#lastUpdated").first() as TextView;
    lastUpdatedLabel.text = `${texts.LAST_UPDATED} ${moment(lastUpdated).format("ll LT")}`;
    data.forEach((blockObject: any) => {
      let collectionView = this.find("#" + blockObject.day).first() as TabrisConCollectionView;
      collectionView.items = blockObject.blocks;
    });
  }

  get data() {
    return this._data;
  }

  private createUI(data: any) {
    this.append(
      <widgetCollection>
        <composite
            class="last-updated-box"
            left={0} top={0} right={0} height={32}
            background={select({
              android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
              default: "initial"
            })}>
          <textView
              id="lastUpdated"
              left={select({ android: 16, windows: 12, ios: null })}
              top={select({ android: 0, default: 12 })}
              centerX={select({ ios: 0, default: null })}
              font={select({
                android: fontToString({ style: "italic", weight: "bold", size: 14 }),
                default: fontToString({ style: "italic", size: 12, family: "sans-serif" })
              })}
              opacity={select({ android: 0.6, default: 1 })}
              textColor={select({
                android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
                default: colors.DARK_SECONDARY_TEXT_COLOR
              })} />
        </composite>
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
      </widgetCollection>
    );
    let tabFolder = this.find("#scheduleTabFolder").first() as TabFolder;
    this.createTabs(tabFolder, data);
  }

  private registerEventHandlers() {
    this.once("appear", () => {
      if (this.data === null) {
        this.initializeItems();
      }
      this.on("appear", () => this.updateFeedbackIndicators());
    });
    app.on("resume", () => this.updateFeedbackIndicators());
  }

  private async highlightSession() {
    if (this.highlightId) {
      let session = this.getSession(this.highlightId);
      this.highlightId = null;
      if (session) {
        let tab = session.collectionView.parent();
        this.find("#scheduleTabFolder").set({selection: tab});
        let index = session.collectionView.items.indexOf(session);
        // iOS needs some time for the UI to be updated. reveal() has no effect if
        // called before the TabFolder completely shows the CollectionView.
        await new Promise(resolve => setTimeout(resolve, 500));
        session.collectionView.reveal(index);
        await new Promise(resolve => setTimeout(resolve, 500));
        let item = session.collectionView.items[index];
        if (item.cell) {
          return await item.cell.highlight();
        }
      }
    }
  }

  private async initializeItems() {
    if (!this.initializingItems) {
      this.initializingItems = true;
      try {
        this.data = await this.viewDataProvider.getBlocks();
      } catch (ex) {
        logError(ex);
      }
      let scheduleDayList = this.find(".scheduleDayList").first() as TabrisConCollectionView;
      scheduleDayList.refreshIndicator = false;
      this.initializingItems = false;
      this.updateFeedbackIndicators();
    }
  }

  private async updateFeedbackIndicators() {
    try {
      let highlightPromise = this.highlightSession();
      let indicatorStatesPromise = this.viewDataProvider.getSessionIdIndicatorStates();
      await highlightPromise;
      let indicatorStates = await indicatorStatesPromise;
      indicatorStates.forEach(({id, state}: any) => this.updateSessionProperty(id, "feedbackIndicatorState", state));
    } catch(e) {
      logError(e);
    }
  }

  private updateSessionProperty(id: string, name: string, value: any) {
    let session = this.getSession(id);
    if (session) {
      session[name] = value;
      session.collectionView.refresh(session.collectionView.items.indexOf(session));
    }
  }

  private getSession(id: string) {
    return this._data
      .reduce((a: any, b: any) => a.concat(b.blocks), [])
      .find((block: any) => block.sessionId === id);
  }

  private createTabs(tabFolder: TabFolder, data: any) {
    data.forEach((blockObject: any, index: number) => {
      tabFolder.append(
        <tab title={blockObject.day} background="white">
          <TabrisConCollectionView
              left={0} top={0} right={0} bottom={0} opacity={index === 0 ? 0 : 1}
              id={blockObject.day}
              class="scheduleDayList"
              items={blockObject.blocks}
              updatable={true}
              viewDataProvider={this.viewDataProvider}
              loginService={this.loginService}
              feedbackService={this.feedbackService} />
        </tab>
      );
      if (index === 0) {
        tabFolder.find(`#${blockObject.day}`).animate({ opacity: 1 }, { duration: 250 });
      }
    });
  }

}
