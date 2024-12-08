import fileReaderComponent from '../pages/file-reader-component';
import spotifyAuthComponent from '../pages/spotify-auth-component';
import { spotifyWebPlayerPage } from '../pages/vendor/spotify/spotify-web-player-page';
import { getCurrentUsersPlaylists, unfollowPlaylist } from '../support/helpers';

suite('utils', function () {
    test.skip('clean e2e test data', async function () {
        await browser.url('/');
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCookies();
        await fileReaderComponent.waitForDisplayed();

        await spotifyWebPlayerPage.open();
        await spotifyWebPlayerPage.waitForDisplayed();

        const accessToken = await spotifyWebPlayerPage.getAccessToken();
        const playlists = await getCurrentUsersPlaylists(accessToken);

        playlists.forEach(async (playlist) => {
            if(playlist.name.toLowerCase().includes('unit test')) {
                return;
            }

            await unfollowPlaylist(playlist.id, accessToken);
            console.log(`unfollwed: ${playlist.name}`);
        });
    });
});
