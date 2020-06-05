import SpotifyWebApi from 'spotify-web-api-js';
import {Song} from './song';
import SpotifyWebApiJs = SpotifyWebApi.SpotifyWebApiJs;

export class SpotifyService {
  spotify: SpotifyWebApiJs;

  constructor(spotify: SpotifyWebApiJs) {
    this.spotify = spotify;
  }

  async loadSpotifyData(songs: Song[]): Promise<any> {
    const promises = [];

    for (const song of songs) {
      const searchResults = this.searchForSong(song.title, song.artist);
      searchResults.then((spotifySong) => {
        song.title = spotifySong.title;
        song.artist = spotifySong.artist;
        song.uri = spotifySong.uri;
        song.previewUrl = spotifySong.previewUrl;
        song.externalUrl = spotifySong.externalUrl;

        if (song.uri === undefined) {
          console.log(song);
        }
      });

      promises.push(searchResults);
      await this.delay(100);
    }

    return Promise.all(promises);
  }

  createPlaylist(userId: string, playlistName: string, songs: Song[]): Promise<string> {
    return new Promise<string>(resolve => {
      this.spotify.createPlaylist(userId, {name: playlistName}).then(data => {
        const chunkSize = 100;
        const playlistId = data.id;
        const matchedSongUris = songs.filter(song => song.uri != null).map(song => song.uri);

        const promises = [];
        for (let i = 0, j = matchedSongUris.length; i < j; i += chunkSize) {
          const chunk = matchedSongUris.slice(i, i + chunkSize);
          promises.push(this.spotify.addTracksToPlaylist(playlistId, chunk));
        }

        Promise.all(promises).then(() => {
          resolve(playlistId);
        });
      });
    });
  }

  private searchForSong(title: string, artist: string): Promise<Song> {
    return new Promise<Song>(resolve => {
      const query = `"${title}" artist:"${artist}"`;
      this.spotify.searchTracks(query, {limit: 1}).then((data) => {
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
