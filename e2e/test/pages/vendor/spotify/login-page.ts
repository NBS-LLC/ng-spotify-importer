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

    async loginWithCredentails(username: string, password: string) {
        await this.usernameElement.setValue(username);
        await this.passwordElement.setValue(password);
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