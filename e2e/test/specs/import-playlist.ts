import spotifyAuthComponent from "../pages/spotify-auth-component"
import config from "../support/config";

describe('import playlist flows', () => {
    it('simple slacker playlist', async () => {
        await browser.url('/')
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCredentials(
            config.getPrimarySpotifyCredentials()
        );
    });
});