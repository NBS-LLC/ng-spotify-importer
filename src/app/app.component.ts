import {Component, OnInit} from '@angular/core';
import {Song} from './song';
import {Playlist} from './playlist';
import {ActivatedRoute} from '@angular/router';
import SpotifyWebApi from 'spotify-web-api-js';
import {SpotifyService} from './spotifyService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Slacker to Spotify';
  playlistName = '';
  songs: Song[] = [];
  songsUnmatched: Song[] = [];
  spotifyAuthUrl: string;
  spotifyAccessToken: string;
  spotifyUserId: string;

  spotify = new SpotifyWebApi();
  spotifyService = new SpotifyService(this.spotify);

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
        this.spotify.getMe().then((data) => {
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

          console.log(`handleFileInput: ${this.songs.length} songs parsed`);

          console.time('loadSpotifyData');
          this.spotifyService.loadSpotifyData(this.songs).then(() => {
            console.timeEnd('loadSpotifyData');

            this.songsUnmatched = this.songs.filter(song => song.uri === undefined);

            this.spotifyService.createPlaylist(this.spotifyUserId, this.playlistName, this.songs).then(playlistId => {
              this.spotify.getPlaylistTracks(playlistId).then(result => {
                console.log(`createPlaylist: ${result.total} tracks added`);
              });
            });
          });
        }
      };

      fileReader.readAsDataURL(files.item(0));
    }
  }
}
