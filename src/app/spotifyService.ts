import SpotifyWebApi from 'spotify-web-api-js';
import {Song} from './song';
import SpotifyWebApiJs = SpotifyWebApi.SpotifyWebApiJs;

export class SpotifyService {
  spotify: SpotifyWebApiJs;

  constructor(spotify: SpotifyWebApiJs) {
    this.spotify = spotify;
  }

  loadSpotifyData(songs: Song[]): Promise<any> {
    const promises = [];

    for (const song of songs) {
      const query = `"${song.title}" artist:"${song.artist}"`;
      const searchResults = this.spotify.searchTracks(query, {limit: 1});

      searchResults.then((data) => {
        if (data.tracks.total > 0) {
          song.uri = data.tracks.items[0].uri;
          song.previewUrl = data.tracks.items[0].preview_url;
          song.externalUrl = data.tracks.items[0].external_urls.spotify;
        }

        if (song.previewUrl === null) {
          console.log(data);
        }
      });

      promises.push(searchResults);
    }

    return Promise.all(promises);
  }
}
