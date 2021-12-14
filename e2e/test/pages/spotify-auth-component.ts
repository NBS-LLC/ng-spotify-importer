import spotifyLoginPage from "./vendor/spotify/login-page";

class SpotifyAuthComponent {
    get componentElement() {
        return $('<app-spotify-auth />');
    }

    get grantElement() {
        return $('=Grant');
    }

    async grantPermissionWithCredentials(username: string, password: string) {
        await this.grantElement.click();
        await spotifyLoginPage.waitForDisplayed();
        await spotifyLoginPage.loginWithCredentails(username, password);
    }

    async waitForDisplayed() {
        return await this.componentElement.waitForDisplayed();
    }
}

export default new SpotifyAuthComponent();