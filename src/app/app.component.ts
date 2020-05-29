import {Component, OnInit} from '@angular/core';
import {Song} from './song';
import {Playlist} from './playlist';
import {ActivatedRoute} from '@angular/router';
import SpotifyWebApi from 'spotify-web-api-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Slacker to Spotify';
  playlistName = '';
  songs: Song[] = [];
  spotifyAuthUrl: string;
  spotifyAccessToken: string;
  spotifyUserId: string;

  spotify = new SpotifyWebApi();

  constructor(private activatedRoute: ActivatedRoute) {
    this.spotifyAuthUrl = this.generateSpotifyAuthUrl();
  }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(hash => {
      if (hash) {
        this.spotifyAccessToken = (new URLSearchParams(hash)).get('access_token');
      }

      if (this.spotifyAccessToken) {
        this.spotify.setAccessToken(this.spotifyAccessToken);
        this.spotify.getMe((err, data) => {
          if (err) {
            // TODO: Handle expired access token.
            console.log(err);
          }

          this.spotifyUserId = data.id;
        });
      }
    });
  }

  generateSpotifyAuthUrl(): string {
    const clientId = 'ee26bb61755e44c5b7e7a0a29c0f7ed5';
    const scope = 'user-read-private user-read-email playlist-modify-public';
    const redirectUrl = 'http://localhost:4200/';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(clientId);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirectUrl);

    return url;
  }

  handleFileInput(inputEvent: Event) {
    const files: FileList = (inputEvent.target as HTMLInputElement).files;
    if (files && files.item(0)) {
      const fileReader = new FileReader();

      fileReader.onload = (readerEvent) => {
        if (typeof readerEvent.target.result === 'string') {
          const contents = readerEvent.target.result.split(',')[1];
          const playlist = new Playlist(atob(contents));

          this.playlistName = playlist.getPlaylistName();
          this.songs = playlist.getSongs();

          this.loadSpotifyData().then(() => {
            this.spotify.createPlaylist(this.spotifyUserId, {name: this.playlistName}).then(data => {
              const playlistId = data.id;

              // TODO: Handle more than 100 songs.
              const matchedSongUris = this.songs.filter(song => song.uri != null).map(song => song.uri);

              // TODO: Ensure all songs are added.
              this.spotify.addTracksToPlaylist(playlistId, matchedSongUris);
            });
          });
        }
      };

      fileReader.readAsDataURL(files.item(0));
    }
  }

  private loadSpotifyData(): Promise<any> {
    const promises = [];

    for (const song of this.songs) {
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
