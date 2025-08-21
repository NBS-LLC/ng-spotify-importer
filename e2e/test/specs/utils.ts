import fileReaderComponent from '../pages/file-reader-component';
import spotifyAuthComponent from '../pages/spotify-auth-component';
import {
    getAppAccessToken,
    getCurrentUsersPlaylists,
    unfollowPlaylist,
} from '../support/helpers';

suite('utils', function () {
    test.skip('clean e2e test data', async function () {
        await browser.url('/');
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCookies();
        await fileReaderComponent.waitForDisplayed();
        const accessToken = await getAppAccessToken();

        const playlists = await getCurrentUsersPlaylists(accessToken);
        for (const playlist of playlists) {
            if (playlist.name.match(/^NGSI QA Auto - \d+$/)) {
                await unfollowPlaylist(playlist.id, accessToken);
                console.log(`unfollowed: ${playlist.name}`);
            }
        }
    });
});
