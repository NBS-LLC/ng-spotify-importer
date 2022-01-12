import { dirname } from "path";
import fileReaderComponent from "../pages/file-reader-component";
import spotifyAuthComponent from "../pages/spotify-auth-component"
import config from "../support/config";

describe('import playlist flows', () => {
    it('simple slacker playlist', async () => {
        await browser.url('/')
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCredentials(
            config.getPrimarySpotifyCredentials()
        );

        const playlistPath = dirname(__filename) + '/../assets/playlists/80sHitsPlaylist.xml';
        await fileReaderComponent.waitForDisplayed();
        await fileReaderComponent.uploadSlackerPlaylist(playlistPath);
        await fileReaderComponent.waitForPlaylistToLoad();

        await driver.debug();
    });
});