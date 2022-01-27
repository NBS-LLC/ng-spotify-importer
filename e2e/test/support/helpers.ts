import { DOMParser } from '@xmldom/xmldom';
import * as Papa from 'papaparse';

export function fileToString(path: string): string {
    const fs = require('fs');

    try {
        return String(fs.readFileSync(path, 'utf8')).trim();
    } catch (err) {
        console.error(err);
    }
}

export function getSongCountFromSpotifyPlaylist(playlistPath: string): number {
    const contents = fileToString(playlistPath);
    const doc = new DOMParser().parseFromString(contents, 'text/xml');
    return doc.getElementsByTagName('song').length;
}

export function getSongCountFromTextPlaylist(playlistPath: string): number {
    const contents = fileToString(playlistPath);
    const csv = Papa.parse(contents, { header: true, });
    return csv.data.length;
}

export function getSongCountFromCSVPlaylist(playlistPath: string): number {
    return getSongCountFromTextPlaylist(playlistPath);
}

export function parseSongCountFromLabel(label: string): number {
    return parseInt(label.match(/Songs \((\d+)\):/)[1], 10);
}

export function parsePlaylistIdFromImportNotification(notification: string): string {
    return notification.match(/Playlist \((\w+)\) imported/)[1];
}