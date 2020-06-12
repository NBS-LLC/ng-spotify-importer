import {Injectable} from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import {Song} from './song';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private spotifyWebApi = new SpotifyWebApi();
  private authenticated = false;

  constructor() {
  }

  getAuthUrl(clientId: string) {
    const scope = 'user-read-private playlist-modify-public';
    const redirectUrl = 'http://localhost:4200/';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(clientId);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirectUrl);

    return url;
  }

  setAccessToken(accessToken: string): void {
    this.spotifyWebApi.setAccessToken(accessToken);
    this.authenticated = true;
  }

  hasAuthenticated(): boolean {
    return this.authenticated;
  }

  loadUserId(): Promise<string> {
    return new Promise<string>(resolve => {
      this.spotifyWebApi.getMe().then(data => {
        resolve(data.id);
      });
    });
  }

  async loadSongData(songs: Song[], songsLoaded?: { count: number }): Promise<any> {
    const promises = [];

    console.time('loadSongData');
    for (const song of songs) {
      const searchResults = this.searchForSong(song.title, song.artist);
      searchResults.then((spotifySong) => {
        song.title = spotifySong.title;
        song.artist = spotifySong.artist;
        song.uri = spotifySong.uri;
        song.previewUrl = spotifySong.previewUrl;
        song.externalUrl = spotifySong.externalUrl;

        if (songsLoaded) {
          songsLoaded.count++;
        }
      });

      promises.push(searchResults);
      await this.delay(100);
    }
    console.timeEnd('loadSongData');

    return Promise.all(promises);
  }

  createPlaylist(userId: string, playlistName: string, songs: Song[]): Promise<string> {
    return new Promise<string>(resolve => {
      this.spotifyWebApi.createPlaylist(userId, {name: playlistName}).then(async data => {
        const chunkSize = 100;
        const playlistId = data.id;
        const matchedSongUris = songs.filter(song => song.uri != null).map(song => song.uri);

        const promises = [];
        for (let i = 0, j = matchedSongUris.length; i < j; i += chunkSize) {
          const chunk = matchedSongUris.slice(i, i + chunkSize);
          promises.push(await this.spotifyWebApi.addTracksToPlaylist(playlistId, chunk));
        }

        Promise.all(promises).then(() => {
          resolve(playlistId);
        });
      });
    });
  }

  loadPlaylistTrackCount(playlistId: string): Promise<number> {
    return new Promise<number>(resolve => {
      const options = {fields: 'total'};
      this.spotifyWebApi.getPlaylistTracks(playlistId, options).then(data => {
        resolve(data.total);
      });
    });
  }

  private searchForSong(title: string, artist: string): Promise<Song> {
    return new Promise<Song>(resolve => {
      const query = `"${title}" artist:"${artist}"`;
      this.spotifyWebApi.searchTracks(query, {limit: 1}).then((data) => {
        const song: Song = {artist, title};
        if (data.tracks.total > 0) {
          song.uri = data.tracks.items[0].uri;
          song.previewUrl = data.tracks.items[0].preview_url;
          song.externalUrl = data.tracks.items[0].external_urls.spotify;
        }
        resolve(song);
      });
    });
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
