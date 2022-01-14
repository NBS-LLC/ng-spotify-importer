import assert = require("assert");
import { dirname } from "path";
import { fileToString, getSongCountFromSpotifyPlaylist, parseSongCountFromLabel } from "./helpers";

describe('helpers', () => {
    describe('fileToString()', () => {
        it('should return the contents of the specified file', () => {
            const contents = fileToString(dirname(__filename) + '/../assets/playlists/80sHitsPlaylist.xml');
            assert.strictEqual(contents.length, 19449);
        });
    });

    describe('getSongCountFromSpotifyPlaylist()', () => {
        it('should get the song count from a spotify playlist (xml file)', () => {
            const playlistPath = dirname(__filename) + '/../assets/playlists/80sHitsPlaylist.xml';
            const songCount = getSongCountFromSpotifyPlaylist(playlistPath);
            assert.strictEqual(songCount, 60);
        });
    });

    describe('parseSongCountFromLabel()', () => {
        it('should return the song count of a playlist editor song label', () => {
            const songCount = parseSongCountFromLabel('All Songs (60):');
            assert.strictEqual(songCount, 60);
        });
    });
});