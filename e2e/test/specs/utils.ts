import fileReaderComponent from '../pages/file-reader-component';
import spotifyAuthComponent from '../pages/spotify-auth-component';
import { spotifyWebPlayerPage } from '../pages/vendor/spotify/spotify-web-player-page';

suite('utils', function () {
    test.skip('clean e2e test data', async function () {
        await browser.url('/');
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCookies();
        await fileReaderComponent.waitForDisplayed();

        await spotifyWebPlayerPage.open();
        await spotifyWebPlayerPage.waitForDisplayed();
        await spotifyWebPlayerPage.deleteAllPlaylists();
    });
});
