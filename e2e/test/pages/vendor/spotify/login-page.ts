import { Credentials } from "../../../support/credentials";

class LoginPage {
    get pageElement() {
        return $("//*[@ng-controller='LoginController']");
    }

    get usernameElement() {
        return $('#login-username');
    }

    get passwordElement() {
        return $('#login-password');
    }

    get loginElement() {
        return $('#login-button');
    }

    async loginWithCredentails(credentials: Credentials) {
        await this.usernameElement.setValue(credentials.username);
        await this.passwordElement.setValue(credentials.password);
        await this.loginElement.click();
    }

    async waitForDisplayed() {
        await browser.waitUntil(async () => {
            return await browser.getTitle() == 'Login - Spotify';
        });

        return this.pageElement.waitForDisplayed();
    }
}

export default new LoginPage();