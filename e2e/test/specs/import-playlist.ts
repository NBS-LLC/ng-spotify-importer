import logger from "@wdio/logger";
import { dirname } from "path";
import fileReaderComponent from "../pages/file-reader-component";
import playlistEditorComponent from "../pages/playlist-editor-component";
import spotifyAuthComponent from "../pages/spotify-auth-component";
import config from "../support/config";
import { getSongCountFromSpotifyPlaylist, parseSongCountFromLabel } from "../support/helpers";

const log = logger('E2E');

describe('import playlist flows', () => {
    it('simple slacker playlist', async () => {
        await browser.url('/')
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCredentials(
            config.getPrimarySpotifyCredentials()
        );

        const playlistPath = dirname(__filename) + '/../assets/playlists/80sHitsPlaylist.xml';
        const expectedSongCount = getSongCountFromSpotifyPlaylist(playlistPath);

        await fileReaderComponent.waitForDisplayed();
        await fileReaderComponent.uploadSlackerPlaylist(playlistPath);
        await fileReaderComponent.waitForPlaylistToLoad();
        await playlistEditorComponent.waitForDisplayed();

        log.info('Verifying that all songs from the playlist are parsed.');

        const allSongsLabel = await playlistEditorComponent.allSongsLabelElement.getText();
        expect(allSongsLabel).toEqual(`All Songs (${expectedSongCount}):`);

        log.info('Verifying that at least half of the parsed songs are known by Spotify.');

        const knownSongsLabel = await playlistEditorComponent.knownSongsLabelElement.getText();
        const knownSongCount = parseSongCountFromLabel(knownSongsLabel);
        expect(knownSongCount).toBeGreaterThanOrEqual(Math.floor(expectedSongCount / 2));
    });
});