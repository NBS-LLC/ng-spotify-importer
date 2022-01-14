import { DOMParser } from "@xmldom/xmldom";
import { dirname } from "path";
import fileReaderComponent from "../pages/file-reader-component";
import playlistEditorComponent from "../pages/playlist-editor-component";
import spotifyAuthComponent from "../pages/spotify-auth-component";
import config from "../support/config";
import { fileToString } from "../support/helpers";

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
        const allSongsLabel = await playlistEditorComponent.allSongsLabelElement.getText();
        expect(allSongsLabel).toEqual(`All Songs (${expectedSongCount}):`);
    });
});

function getSongCountFromSpotifyPlaylist(playlistPath: string): number {
    const contents = fileToString(playlistPath);
    const doc = new DOMParser().parseFromString(contents, 'text/xml');
    return doc.getElementsByTagName('song').length;
}
