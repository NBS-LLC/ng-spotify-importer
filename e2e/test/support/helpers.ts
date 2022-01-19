import { DOMParser } from "@xmldom/xmldom";

export function fileToString(path: string): string {
    const fs = require('fs');

    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        console.error(err)
    }
}

export function getSongCountFromSpotifyPlaylist(playlistPath: string): number {
    const contents = fileToString(playlistPath);
    const doc = new DOMParser().parseFromString(contents, 'text/xml');
    return doc.getElementsByTagName('song').length;
}

export function parseSongCountFromLabel(label: string): number {
    return parseInt(label.match(/Songs \((\d+)\):/)[1], 10);
}

export function parsePlaylistIdFromImportNotification(notification: string): string {
    return notification.match(/Playlist \((\w+)\) imported/)[1];
}