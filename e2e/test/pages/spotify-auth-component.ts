import { Credentials } from "../support/credentials";
import spotifyLoginPage from "./vendor/spotify/login-page";

class SpotifyAuthComponent {
    get componentElement() {
        return $('<app-spotify-auth />');
    }

    get grantElement() {
        return $('=Grant');
    }

    async grantPermissionWithCredentials(credentials: Credentials) {
        await this.grantElement.click();
        await spotifyLoginPage.waitForDisplayed();
        await spotifyLoginPage.loginWithCredentails(credentials);
    }

    async waitForDisplayed() {
        return await this.componentElement.waitForDisplayed();
    }
}

export default new SpotifyAuthComponent();