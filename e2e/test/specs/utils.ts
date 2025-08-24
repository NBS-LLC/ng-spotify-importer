import { getCurrentUsersPlaylists, grantAppSpotifyAccess, unfollowPlaylist } from '../support/helpers';

suite('utils', function () {
  test.skip('clean e2e test data', async function () {
    const accessToken = await grantAppSpotifyAccess();
    const playlists = await getCurrentUsersPlaylists(accessToken);
    for (const playlist of playlists) {
      if (playlist.name.match(/^NGSI QA Auto - \d+$/)) {
        await unfollowPlaylist(playlist.id, accessToken);
        console.log(`unfollowed: ${playlist.name}`);
      }
    }
  });
});
