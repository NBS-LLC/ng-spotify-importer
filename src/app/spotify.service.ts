import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import { BehaviorSubject, Observable } from 'rxjs';
import SpotifyWebApi from 'spotify-web-api-js';

import { environment } from '../environments/environment';

import { Song } from './song';

export interface RefreshableToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  onAuthChange: Observable<boolean> = this.isAuthenticated.asObservable();
  private authenticated = false;

  constructor(
    private http: HttpClient,
    @Inject('SpotifyWebApiJs') private spotifyWebApi: SpotifyWebApi.SpotifyWebApiJs
  ) {}

  generateCodeVerifier(): string {
    const code = CryptoJS.lib.WordArray.random(56 / 2);
    return CryptoJS.enc.Hex.stringify(code);
  }

  generateCodeChallenge(codeVerifier: string): string {
    const hashed = sha256(codeVerifier);
    return Base64.stringify(hashed).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  setAccessToken(token: RefreshableToken) {
    this.spotifyWebApi.setAccessToken(token.access_token);
    this.setAuthenticated(true);

    if (this.testUseOnly) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).spotifyWebApi = this.spotifyWebApi;
    }

    setTimeout(
      () => {
        this.getRefreshedToken(token.refresh_token).then((refreshedToken) => {
          this.setAccessToken(refreshedToken);
        });
      },
      (token.expires_in - 60) * 1000
    ); // Refresh the token 1 minute before it expires.
  }

  getRefreshedToken(refreshToken: string): Promise<RefreshableToken> {
    const body = new HttpParams()
      .set('client_id', environment.spotify.clientId)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    return new Promise<RefreshableToken>((resolve) => {
      this.http.post('https://accounts.spotify.com/api/token', body).subscribe((data: RefreshableToken) => {
        resolve(data);
      });
    });
  }

  setAuthenticated(value: boolean) {
    this.authenticated = value;
    this.isAuthenticated.next(value);
  }

  hasAuthenticated(): boolean {
    return this.authenticated;
  }

  loadUserId(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.spotifyWebApi.getMe().then((data) => {
        resolve(data.id);
      });
    });
  }

  async loadSongData(songs: Song[], songsLoaded?: { count: number }): Promise<unknown> {
    const promises = [];

    console.time('loadSongData');
    for (const song of songs) {
      const searchPromise = this.searchForSong(song.title, song.artist)
        .then((spotifySong) => {
          song.title = spotifySong.title;
          song.artist = spotifySong.artist;
          song.uri = spotifySong.uri;
          song.previewUrl = spotifySong.previewUrl;
          song.externalUrl = spotifySong.externalUrl;

          if (songsLoaded) {
            songsLoaded.count++;
          }
        })
        .catch((error) => {
          console.error('Error loading song data.\nSong: %O\nError: %O', song, error);
        });

      promises.push(searchPromise);
      await this.delay(100);
    }
    console.timeEnd('loadSongData');

    return Promise.all(promises);
  }

  createPlaylist(userId: string, playlistName: string, songs: Song[]): Promise<string> {
    return new Promise<string>((resolve) => {
      this.spotifyWebApi.createPlaylist(userId, { name: playlistName }).then(async (data) => {
        const chunkSize = 100;
        const playlistId = data.id;
        const matchedSongUris = songs.filter((song) => song.uri != null).map((song) => song.uri);

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
    return new Promise<number>((resolve) => {
      const options = { fields: 'total' };
      this.spotifyWebApi.getPlaylistTracks(playlistId, options).then((data) => {
        resolve(data.total);
      });
    });
  }

  loadPageOfSongs(title: string, artist: string, pageNumber: number): Promise<Song[] | null> {
    return new Promise<Song[]>((resolve) => {
      const query = `"${title}" artist:"${artist}"`;
      const limit = 10;
      const offset = (pageNumber - 1) * limit;

      this.spotifyWebApi.searchTracks(query, { offset, limit }).then((data) => {
        if (data.tracks.total > 0) {
          const songs: Song[] = [];
          for (const track of data.tracks.items) {
            const song: Song = { artist: track.artists.pop().name, title: track.name };
            song.uri = track.uri;
            song.previewUrl = track.preview_url;
            song.externalUrl = track.external_urls.spotify;
            songs.push(song);
            resolve(songs);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  private searchForSong(title: string, artist: string): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
      const query = `${title} artist:${artist}`;
      this.spotifyWebApi.searchTracks(query, { limit: 1 }).then(
        (data) => {
          const song: Song = { artist, title };
          if (data.tracks.total > 0) {
            song.uri = data.tracks.items[0].uri;
            song.previewUrl = data.tracks.items[0].preview_url;
            song.externalUrl = data.tracks.items[0].external_urls.spotify;
          }
          resolve(song);
        },
        (error) => reject(error)
      );
    });
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getTrackById(spotifyId: string): Promise<Song | null> {
    return new Promise<Song>((resolve) => {
      this.spotifyWebApi.getTrack(spotifyId).then((track) => {
        if (track) {
          const song: Song = { artist: track.artists.pop().name, title: track.name };
          song.uri = track.uri;
          song.previewUrl = track.preview_url;
          song.externalUrl = track.external_urls.spotify;
          resolve(song);
        } else {
          resolve(null);
        }
      });
    });
  }

  private testUseOnly(): boolean {
    return window?.location?.hostname == 'localhost';
  }
}
