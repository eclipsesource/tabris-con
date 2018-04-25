import fontToString from "../helpers/fontToString";
import { select } from "../helpers/platform";
import ProgressButton from "../components/ProgressButton";
import { Page, PageProperties, TextInput } from "tabris";
import texts from "../resources/texts";
import colors from "../resources/colors";
import config from "../configs/config";
import LoginService from "../helpers/CodLoginService";
import { component, property, getById } from "tabris-decorators";

interface LoginPageProperties {
  loginService: LoginService;
}

@component export default class LoginPage extends Page {

  public jsxProperties: JSX.PageProperties & LoginPageProperties & { onLoginSuccess?: () => void };
  public tsProperties: PageProperties & LoginPageProperties;

  @getById private userInput: TextInput;
  @getById private passwordInput: TextInput;
  @getById private loginButton: ProgressButton;
  @property private loginService: LoginService;

  constructor(properties: PageProperties & LoginPageProperties) {
    super();
    this.append(
      <scrollView
          left={0} top={0} right={0} bottom={0}>
        <composite
            left={0} top={0} right={0} height={160}
            background={select({android: colors.BACKGROUND_COLOR, default: "white"})}>
          <textView
              text={`${texts.LOGIN_TO} ${config.CONFERENCE_NAME}`}
              left={16} bottom={16} right={16}
              textColor={select({ios: colors.DARK_PRIMARY_TEXT_COLOR, default: "white"})}
              alignment={select({ios: "center", default: "left"})}
              font={TITLE_FONT} />
        </composite>
        <composite
            width={280} centerX={0} top="prev() 16">
          <textInput
              id="userInput"
              left={0} right={0}
              borderColor={select({android: colors.BACKGROUND_COLOR, default: "initial"})}
              message="eclipse.org e-mail address"
              onTextChanged={() => this.validateInput()}/>
          <textInput
              id="passwordInput"
              left={0} top="prev() 8" right={0}
              borderColor={select({android: colors.BACKGROUND_COLOR, default: "initial"})}
              type="password"
              message="password"
              onTextChanged={() => this.validateInput()}/>
          <ProgressButton
              id="loginButton"
              top="prev() 8" right={select({android: 0, default: null})} centerX={select({ios: 0, default: null})}
              font={BUTTON_FONT}
              text={texts.LOGIN_BUTTON}
              enabled={false}
              onSelect={() => this.login()} />
        </composite>
      </scrollView>
    );
    this.set(properties);
  }

  private login() {
    this.loginButton.showProgress(true);
    this.loginService
      .onLoginSuccess(this.onLoginSuccess)
      .onLoginError(this.onLoginError)
      .login(this.userInput.text, this.passwordInput.text);
  }

  private onLoginSuccess = () => {
    this.trigger("loginSuccess");
    this.loginService.offLoginSuccess(this.onLoginSuccess);
    this.dispose();
  }

  private onLoginError = () => {
    this.loginButton.showProgress(false);
    this.loginService.offLoginError(this.onLoginError);
  }

  private validateInput() {
    this.loginButton.enabled = this.userInput.text.length > 0 && this.passwordInput.text.length > 0;
  }

}

const TITLE_FONT = select({
  ios: fontToString({weight: "bold", size: 24}),
  default: fontToString({weight: "bold", size: 18})
});

const BUTTON_FONT = fontToString({
  weight: "bold", size: select({ ios: 24, default: 16 })
});
