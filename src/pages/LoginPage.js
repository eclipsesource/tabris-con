import sizes from "../resources/sizes";
import colors from "../resources/colors";
import fontToString from "../helpers/fontToString";
import Input from "../components/Input";
import ProgressButton from "../components/ProgressButton";
import {Page, ScrollView, Composite, TextView} from "tabris";

export default class extends Page {
  constructor(loginService) {
    super({topLevel: false, id: "loginPage"});
    this._loginService = loginService;

    this.append(
      new ScrollView({id: "containerScrollView"}).append(
        new Composite({id: "pageHeader"}).append(
          new TextView({id: "loginTextView"})
        ),
        new Composite({id: "inputContainer"}).append(
          new Input({id: "usernameInput"}),
          new Input({id: "passwordInput"}),
          new ProgressButton({id: "loginButton"})
        )
      )
    );

    this.on("appear", () => this._onPageAppear());
    this.on("disappear", () => this._onPageDisappear());
    this.on("loginSuccess", () => this._onLoginSuccess());
    this.on("loginFailure", () => this._onLoginFailure());
    this.find("#usernameInput").on("change:text", () => this._onInputSelect());
    this.find("#passwordInput").on("change:text", () => this._onInputSelect());
    this.find("#loginButton").on("select", widget => this._onProgressButtonSelect(widget));

    this.apply({
      ScrollView: {left: 0, top: 0, right: 0, bottom: 0},
      "#pageHeader": select({
        common: {left: 0, top: 0, right: 0, height: sizes.PROFILE_AREA_TOP_OFFSET},
        Android: {background: colors.BACKGROUND_COLOR},
        iOS: {background: "white"}
      }),
      "#loginTextView": select({
        common: {
          text: "EclipseCon Login",
          font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
          left: sizes.MARGIN_LARGE, bottom: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE
        },
        Android: {textColor: "white"},
        iOS: {
          alignment: "center",
          font: fontToString({weight: "bold", size: sizes.FONT_XXXLARGE}),
          textColor: colors.DARK_PRIMARY_TEXT_COLOR
        }
      }),
      "#inputContainer": {
        width: sizes.PAGE_CONTAINER_WIDTH, centerX: 0, top: ["#pageHeader", sizes.MARGIN_LARGE]
      },
      "#usernameInput": {
        left: 0, right: 0,
        message: "eclipse.org e-mail address"
      },
      "#passwordInput": {
        type: "password",
        left: 0, right: 0,
        top: ["#usernameInput", sizes.MARGIN],
        message: "password"
      },
      "#loginButton": {
        text: "Login", enabled: false
      }
    });
  }

  _onPageAppear() {
    tabris.ui.find("#loginAction").set("visible", false);
  }

  _onPageDisappear() {
    tabris.ui.find("#loginAction").set("visible", true);
  }

  _onLoginSuccess() {
    this.close();
  }

  _onLoginFailure() {
    this.find("#loginButton").set("progress", false);
  }

  _onProgressButtonSelect(widget) {
    widget.set("progress", true);
    this._loginService.login(this.find("#usernameInput").get("text"), this.find("#passwordInput").get("text"));
  }

  _onInputSelect() {
    this.find("#loginButton").set("enabled", this._inputValid());
  }

  _inputValid() {
    let usernameInput = this.find("#usernameInput").first();
    let passwordInput = this.find("#passwordInput").first();
    return usernameInput.get("text").length > 0 && passwordInput.get("text").length > 0;
  }
}

function select(styles) {
  return Object.assign({}, styles[device.platform], styles.common);
}