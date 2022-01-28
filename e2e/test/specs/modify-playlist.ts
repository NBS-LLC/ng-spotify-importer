import { dirname } from 'path';
import fileReaderComponent from '../pages/file-reader-component';
import playlistEditorComponent from '../pages/playlist-editor-component';
import spotifyAuthComponent from '../pages/spotify-auth-component';
import config from '../support/config';

suite('modify playlist flows', function () {
    test('fix unknown song', async function () {
        console.log('Load a playlist that contains an unknown song.');

        const playlistPath = dirname(__filename) + '/../assets/playlists/CommaSeparatedValuesExample.csv';

        await browser.url('/');
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCredentials(
            config.getPrimarySpotifyCredentials()
        );

        await fileReaderComponent.waitForDisplayed();
        await fileReaderComponent.uploadCSVPlaylist(playlistPath);
        await fileReaderComponent.waitForPlaylistToLoad();
        await playlistEditorComponent.waitForDisplayed();

        const songDataRowComponent = await playlistEditorComponent.getSongDataRowComponentBySongTitle(
            'Twilight vs Breathe (Jack Trades Remix)'
        );

        console.log('Display more (related) songs.');

        await songDataRowComponent.clickMore();
        await driver.debug();

        console.log('Modify the title and artist.');
        console.log('Search for more (related) songs.');
        console.log('Select the correct (related) known song.');
        console.log('Import the modified playlist into Spotify.');
        console.log('Verify the Spotify playlist contains all of the known songs.');
        console.log('Verify the Spotify playlist contains the fixed (previously unknown) song.');
    });
});
