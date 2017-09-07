import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import Input from "../components/Input";
import ProgressButton from "../components/ProgressButton";
import {Page, ScrollView, Composite, TextView} from "tabris";
import texts from "../resources/texts";
import config from "../configs/config";

export default class extends Page {
  constructor(loginService) {
    super({id: "loginPage"});

    let scrollView = new ScrollView({left: 0, top: 0, right: 0, bottom: 0}).appendTo(this);

    let header = new Composite({
      id: "pageHeader",
      left: 0, top: 0, right: 0, height: sizes.PROFILE_AREA_TOP_OFFSET
    }).appendTo(scrollView);

    applyPlatformStyle(header);

    let loginTextView = new TextView({
      id: "loginTextView",
      text: `${texts.LOGIN_TO} ${config.CONFERENCE_NAME}`,
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
      left: sizes.MARGIN_LARGE, bottom: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE
    }).appendTo(header);

    applyPlatformStyle(loginTextView);

    let inputContainer = new Composite({
      id: "inputContainer",
      width: sizes.PAGE_CONTAINER_WIDTH, centerX: 0, top: [header, sizes.MARGIN_LARGE]
    }).appendTo(scrollView);

    let usernameInput = new Input({
      id: "usernameInput",
      left: 0, right: 0,
      message: "eclipse.org e-mail address"
    }).on("textChanged", () => this._updateLoginButtonState()).appendTo(inputContainer);

    let passwordInput = new Input({
      type: "password",
      id: "passwordInput",
      left: 0, right: 0,
      top: [usernameInput, sizes.MARGIN],
      message: "password"
    }).on("textChanged", () => this._updateLoginButtonState()).appendTo(inputContainer);

    let button = new ProgressButton({id: "loginButton", text: texts.LOGIN_BUTTON, enabled: false})
      .on("select", () => {
        button.showProgress(true);
        loginService.login(usernameInput.text, passwordInput.text);
      })
      .appendTo(inputContainer);

    let loginAction = tabris.ui.find("#loginAction").first();

    this
      .on("appear", () => loginAction.visible = false)
      .on("disappear", () => loginAction.visible = true);

    let loginSuccessHandler = () => {
      this.trigger("loginSuccess");
      this.dispose();
    };
    let loginErrorHandler = () => this.find("#loginButton").first().showProgress(false);

    loginService
      .onLoginSuccess(loginSuccessHandler)
      .onLoginError(loginErrorHandler);

    this.on("dispose", () => {
      loginService
        .offLoginSuccess(loginSuccessHandler)
        .offLoginError(loginErrorHandler);
    });
  }

  _updateLoginButtonState() {
    this.find("#loginButton").first().enabled = this._inputValid();
  }

  _inputValid() {
    let usernameInput = this.find("#usernameInput").first();
    let passwordInput = this.find("#passwordInput").first();
    return usernameInput.text.length > 0 && passwordInput.text.length > 0;
  }
}
