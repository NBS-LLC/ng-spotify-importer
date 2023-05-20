import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import {
    fileToString,
    getSongCountFromCSVPlaylist,
    getSongCountFromSpotifyPlaylist,
    parsePlaylistIdFromImportNotification,
    parseSongCountFromLabel
} from './helpers';

describe('helpers', () => {
    describe('fileToString()', () => {
        it('should return the contents of a specified file', () => {
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

    describe('getSongCountFromCSVPlaylist()', () => {
        it('should get the song count from a csv playlist (csv file)', () => {
            const playlistPath = dirname(__filename) + '/../assets/playlists/CommaSeparatedValuesExample.csv';
            const songCount = getSongCountFromCSVPlaylist(playlistPath);
            assert.strictEqual(songCount, 4);
        });
    });

    describe('getSongCountFromTextPlaylist()', () => {
        it('should get the song count from a csv playlist (csv file)', () => {
            const playlistPath = dirname(__filename) + '/../assets/playlists/CsvAsTextExample.txt';
            const songCount = getSongCountFromCSVPlaylist(playlistPath);
            assert.strictEqual(songCount, 4);
        });
    });

    describe('parseSongCountFromLabel()', () => {
        it('should return the song count from a playlist editor filter label', () => {
            const songCount = parseSongCountFromLabel('All Songs (60):');
            assert.strictEqual(songCount, 60);
        });
    });

    describe('parsePlaylistIdFromImportNotification()', () => {
        it('should return the playlist id from an import notification message', () => {
            const playlistId = parsePlaylistIdFromImportNotification('SUCCESS: Playlist (5ag2PxDhgA0IXOU6Y2RGht) imported with 57 tracks.');
            assert.strictEqual(playlistId, '5ag2PxDhgA0IXOU6Y2RGht');
        });
    });
});
