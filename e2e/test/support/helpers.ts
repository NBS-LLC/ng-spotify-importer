import { DOMParser } from '@xmldom/xmldom';
import fs from 'node:fs';
import * as Papa from 'papaparse';
import { SpotifyClient } from '../services/spotify-client';
import config from './config';

export function fileToString(path: string): string {
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

export async function setSpotifyAuthToken() {
    await browser.setCookies({ name: 'sp_dc', value: config.getSpotifyAuthTokenPrimary() });
    await browser.refresh();
}

export async function unfollowPlaylist(playlistId: string, accessToken: string) {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export interface PlaylistItem {
    id: string,
    name: string
}

export async function getCurrentUsersPlaylists(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return (await response.json()).items as PlaylistItem[];
}

export async function waitForPlaylistToLoad(spotifyClient: SpotifyClient, playlistId: string) {
    return await browser.waitUntil(async() => {
        const playlistDetails = await spotifyClient.getPlaylistDetailsById(playlistId);
        if (playlistDetails.body.tracks.total > 0) {
            return playlistDetails;
        };
    });
}
