import logger from "@wdio/logger";
import { dirname } from "path";
import fileReaderComponent from "../pages/file-reader-component";
import notificationComponent from "../pages/notification-component";
import playlistEditorComponent from "../pages/playlist-editor-component";
import spotifyAuthComponent from "../pages/spotify-auth-component";
import config from "../support/config";
import { getSongCountFromSpotifyPlaylist, parseSongCountFromLabel } from "../support/helpers";

const log = logger('e2e - import playlist flows');

describe('import playlist flows', () => {
    describe('simple slacker playlist', async () => {
        const playlistPath = dirname(__filename) + '/../assets/playlists/80sHitsPlaylist.xml';
        const expectedSongCount = getSongCountFromSpotifyPlaylist(playlistPath);

        it('should load a slacker playlist', async () => {
            await browser.url('/')
            await spotifyAuthComponent.waitForDisplayed();
            await spotifyAuthComponent.grantPermissionWithCredentials(
                config.getPrimarySpotifyCredentials()
            );

            await fileReaderComponent.waitForDisplayed();
            await fileReaderComponent.uploadSlackerPlaylist(playlistPath);
            await fileReaderComponent.waitForPlaylistToLoad();
            await playlistEditorComponent.waitForDisplayed();
        })

        it('should parse all songs from the playlist', async () => {
            const allSongsLabel = await playlistEditorComponent.allSongsLabelElement.getText();
            expect(allSongsLabel).toEqual(`All Songs (${expectedSongCount}):`);
        });

        it('spotify should know at least half of the parsed songs', async () => {
            const knownSongsLabel = await playlistEditorComponent.knownSongsLabelElement.getText();
            const knownSongCount = parseSongCountFromLabel(knownSongsLabel);
            expect(knownSongCount).toBeGreaterThanOrEqual(Math.floor(expectedSongCount / 2));
        });

        it('should be able to import the playlist', async () => {
            const uid = Date.now();
            const playlistName = `NGSI QA Auto - ${uid}`;
            await playlistEditorComponent.importPlaylist(playlistName);
            await notificationComponent.waitForDisplayed();
            const notificationMessage = await notificationComponent.componentElement.getText();

            const knownSongsLabel = await playlistEditorComponent.knownSongsLabelElement.getText();
            const knownSongCount = parseSongCountFromLabel(knownSongsLabel);
            expect(notificationMessage).toEqual(`SUCCESS: Playlist imported with ${knownSongCount} tracks.`);

            log.info(`Imported playlist: ${playlistName}`);
        });
    });
});