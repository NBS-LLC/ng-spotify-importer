import { dirname } from 'path';
import fileReaderComponent from '../pages/file-reader-component';
import notificationComponent from '../pages/notification-component';
import playlistEditorComponent from '../pages/playlist-editor-component';
import { songDetailsComponent } from '../pages/song-details-component';
import spotifyAuthComponent from '../pages/spotify-auth-component';
import { SpotifyClient } from '../services/spotify-client';
import { getSongCountFromCSVPlaylist, parsePlaylistIdFromImportNotification } from '../support/helpers';
import { testDataManager } from '../support/test-data-manager';

suite('modify playlist flows', function () {
    test('fix unknown song', async function () {
        console.log('Load a playlist that contains an unknown song.');

        const playlistPath = dirname(__filename) + '/../assets/playlists/CommaSeparatedValuesExample.csv';

        await browser.url('/');
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCookies();

        await fileReaderComponent.waitForDisplayed();
        await fileReaderComponent.uploadCSVPlaylist(playlistPath);
        await fileReaderComponent.waitForPlaylistToLoad();
        await playlistEditorComponent.waitForDisplayed();

        console.log('Fix the unknown song\'s title and artist.');

        const songDataRowComponent = await playlistEditorComponent.getSongDataRowComponentBySongTitle(
            'Twilight vs Breathe (Jack Trades Remix)'
        );

        await songDataRowComponent.clickMore();
        await songDetailsComponent.waitForDisplayed();
        await songDetailsComponent.songTitleElement.setValue('Twilight vs Breathe');
        await songDetailsComponent.songArtistElement.setValue('Adam K');
        await songDetailsComponent.clickSearch();
        await songDetailsComponent.waitForSearchResults();

        console.log('Select the correct (related) known song.');

        const modifiedSongTitle = await songDetailsComponent.getSearchResultSongTitleByIndex(0);
        await songDetailsComponent.clickSearchResultRowByTitle(modifiedSongTitle);

        console.log('Import the modified playlist into Spotify.');

        const uid = Date.now();
        const playlistName = `NGSI QA Auto - ${uid}`;
        await playlistEditorComponent.importPlaylist(playlistName);
        testDataManager.addPlaylistName(playlistName);

        await notificationComponent.waitForDisplayed();
        const notificationMessage = await notificationComponent.componentElement.getText();
        expect(notificationMessage).toContain('SUCCESS');

        console.log('Verify the Spotify playlist contains all of the known songs.');

        const actualKnownSongCount = getSongCountFromCSVPlaylist(playlistPath);

        const spotifyClient = await SpotifyClient.getInstance();
        const playlistId = parsePlaylistIdFromImportNotification(notificationMessage);
        const playlistDetails = await spotifyClient.getPlaylistDetailsById(playlistId);
        expect(playlistDetails.body.name).toEqual(playlistName);
        expect(playlistDetails.body.tracks.total).toEqual(actualKnownSongCount);

        console.log('Verify the Spotify playlist contains the fixed (previously unknown) song.');

        const found = playlistDetails.body.tracks.items.find((item) => item.track.name === modifiedSongTitle);
        expect(found).toBeTruthy();

        console.log(`Imported playlist name: ${playlistName}.`);
    });
});
