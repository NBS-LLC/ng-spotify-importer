import { dirname } from 'path';
import fileReaderComponent from '../pages/file-reader-component';
import notificationComponent from '../pages/notification-component';
import playlistEditorComponent from '../pages/playlist-editor-component';
import spotifyAuthComponent from '../pages/spotify-auth-component';
import { SpotifyClient } from '../services/spotify-client';
import config from '../support/config';
import { getSongCountFromCSVPlaylist, getSongCountFromSpotifyPlaylist, parsePlaylistIdFromImportNotification, parseSongCountFromLabel } from '../support/helpers';

suite('import playlist flows', function () {
    test('simple slacker playlist', async function () {
        const playlistPath = dirname(__filename) + '/../assets/playlists/80sHitsPlaylist.xml';
        const expectedSongCount = getSongCountFromSpotifyPlaylist(playlistPath);

        console.log('Load a Slacker playlist.');

        await browser.url('/');
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCredentials(
            config.getPrimarySpotifyCredentials()
        );

        await fileReaderComponent.waitForDisplayed();
        await fileReaderComponent.uploadSlackerPlaylist(playlistPath);
        await fileReaderComponent.waitForPlaylistToLoad();
        await playlistEditorComponent.waitForDisplayed();

        console.log('Verify that all songs from the playlist are parsed.');

        const allSongsLabel = await playlistEditorComponent.allSongsLabelElement.getText();
        expect(allSongsLabel).toEqual(`All Songs (${expectedSongCount}):`);

        console.log('Verify that Spotify knows at least half of the songs.');

        const knownSongsLabel = await playlistEditorComponent.knownSongsLabelElement.getText();
        const knownSongCount = parseSongCountFromLabel(knownSongsLabel);
        expect(knownSongCount).toBeGreaterThanOrEqual(Math.floor(expectedSongCount / 2));

        console.log('Verify that the playlist can be imported into Spotify.');

        const uid = Date.now();
        const playlistName = `NGSI QA Auto - ${uid}`;
        await playlistEditorComponent.importPlaylist(playlistName);

        console.log('Verify that a success message displays after importing.');

        await notificationComponent.waitForDisplayed();
        const notificationMessage = await notificationComponent.componentElement.getText();
        expect(notificationMessage).toContain('SUCCESS');
        expect(notificationMessage).toContain(`${knownSongCount} tracks`);

        console.log('Verify the Spotify playlist contains all of the known songs.');

        const spotifyClient = await SpotifyClient.getInstance();
        const playlistId = parsePlaylistIdFromImportNotification(notificationMessage);
        const playlistDetails = await spotifyClient.getPlaylistDetailsById(playlistId);
        expect(playlistDetails.body.name).toEqual(playlistName);
        expect(playlistDetails.body.tracks.total).toEqual(knownSongCount);

        console.log(`Imported playlist name: ${playlistName}.`);
    });

    test('simple csv playlist', async function () {
        const playlistPath = dirname(__filename) + '/../assets/playlists/CommaSeparatedValuesExample.csv';
        const expectedSongCount = getSongCountFromCSVPlaylist(playlistPath);

        console.log('Load a CSV playlist.');

        await browser.url('/');
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCredentials(
            config.getPrimarySpotifyCredentials()
        );

        await fileReaderComponent.waitForDisplayed();
        await fileReaderComponent.uploadCSVPlaylist(playlistPath);
        await fileReaderComponent.waitForPlaylistToLoad();
        await playlistEditorComponent.waitForDisplayed();

        console.log('Verify that all songs from the playlist are parsed.');

        const allSongsLabel = await playlistEditorComponent.allSongsLabelElement.getText();
        expect(allSongsLabel).toEqual(`All Songs (${expectedSongCount}):`);

        console.log('Verify that Spotify knows at least half of the songs.');

        const knownSongsLabel = await playlistEditorComponent.knownSongsLabelElement.getText();
        const knownSongCount = parseSongCountFromLabel(knownSongsLabel);
        expect(knownSongCount).toBeGreaterThanOrEqual(Math.floor(expectedSongCount / 2));

        console.log('Verify that the playlist can be imported into Spotify.');

        const uid = Date.now();
        const playlistName = `NGSI QA Auto - ${uid}`;
        await playlistEditorComponent.importPlaylist(playlistName);

        console.log('Verify that a success message displays after importing.');

        await notificationComponent.waitForDisplayed();
        const notificationMessage = await notificationComponent.componentElement.getText();
        expect(notificationMessage).toContain('SUCCESS');
        expect(notificationMessage).toContain(`${knownSongCount} tracks`);

        console.log('Verify the Spotify playlist contains all of the known songs.');

        const spotifyClient = await SpotifyClient.getInstance();
        const playlistId = parsePlaylistIdFromImportNotification(notificationMessage);
        const playlistDetails = await spotifyClient.getPlaylistDetailsById(playlistId);
        expect(playlistDetails.body.name).toEqual(playlistName);
        expect(playlistDetails.body.tracks.total).toEqual(knownSongCount);

        console.log(`Imported playlist name: ${playlistName}.`);
    });
});
