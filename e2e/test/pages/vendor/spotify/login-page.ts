import { Credentials } from '../../../support/credentials';

class LoginPage {
    get usernameElement() {
        return $('#login-username');
    }

    get passwordElement() {
        return $('#login-password');
    }

    get loginElement() {
        return $('#login-button');
    }

    async loginWithCredentials(credentials: Credentials) {
        await this.usernameElement.setValue(credentials.username);
        await this.passwordElement.setValue(credentials.password);
        await this.loginElement.click();
    }

    async waitForDisplayed() {
        await browser.waitUntil(async () => {
            return await browser.getTitle() === 'Login - Spotify';
        });
    }
}

export default new LoginPage();
