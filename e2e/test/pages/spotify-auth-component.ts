import config from '../support/config';
import { Credentials } from '../support/credentials';
import authorizePage from './vendor/spotify/authorize-page';
import spotifyLoginPage from './vendor/spotify/login-page';

class SpotifyAuthComponent {
    get componentElement() {
        return $('<app-spotify-auth />');
    }

    get grantElement() {
        return $('=Grant');
    }

    async grantPermissionWithCookies() {
        await this.grantElement.click();

        await browser.setCookies({ name: 'sp_dc', value: config.getSpotifyAuthTokenPrimary() });
        await browser.refresh();

        await authorizePage.waitForDisplayed();
        await authorizePage.clickAgree();
    }

    async grantPermissionWithCredentials(credentials: Credentials) {
        await this.grantElement.click();
        try {
            await spotifyLoginPage.waitForDisplayed();
            await spotifyLoginPage.loginWithCredentials(credentials);
        } catch {
            console.warn('Spotify login page not displayed. Already logged in?');
        }
        await authorizePage.waitForDisplayed();
        await authorizePage.clickAgree();
    }

    async waitForDisplayed() {
        return await this.componentElement.waitForDisplayed();
    }
}

export default new SpotifyAuthComponent();
