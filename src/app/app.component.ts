import {Component, OnInit} from '@angular/core';
import {Song} from './song';
import {Playlist} from './playlist';
import {SpotifyService} from './spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Slacker to Spotify';
  playlistName = '';
  songs: Song[] = [];
  songsKnown: Song[] = [];
  songsUnknown: Song[] = [];
  songsLoaded = {count: 0, finished: false};
  songsDisplayed: Song[] = [];

  constructor(public spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
  }

  handleFileInput(inputEvent: Event) {
    this.playlistName = '';
    this.songs = [];
    this.songsKnown = [];
    this.songsUnknown = [];
    this.songsLoaded = {count: 0, finished: false};
    this.songsDisplayed = [];

    const files: FileList = (inputEvent.target as HTMLInputElement).files;
    if (files && files.item(0)) {
      const fileReader = new FileReader();

      fileReader.onload = (readerEvent) => {
        if (typeof readerEvent.target.result === 'string') {
          const contents = readerEvent.target.result.split(',')[1];
          const playlist = new Playlist(atob(contents));

          this.playlistName = playlist.getPlaylistName();
          this.songs = playlist.getSongs();
          this.songsDisplayed = this.songs;

          console.log(`handleFileInput: ${this.songs.length} songs parsed`);

          this.spotifyService.loadSongData(this.songs, this.songsLoaded).then(() => {
            this.songsLoaded.finished = true;

            this.songsKnown = this.songs.filter(song => song.uri);
            this.songsUnknown = this.songs.filter(song => song.uri === undefined);

            this.spotifyService.loadUserId().then(userId => {
              this.spotifyService.createPlaylist(userId, this.playlistName, this.songs).then(playlistId => {
                this.spotifyService.loadPlaylistTrackCount(playlistId).then(trackCount => {
                  console.log(`createPlaylist: ${trackCount} tracks added`);
                });
              });
            });
          });
        }
      };

      fileReader.readAsDataURL(files.item(0));
    }
  }

  handleSongFilterChange(inputEvent: Event) {
    const filter = (inputEvent.target as HTMLInputElement).value;
    switch (filter) {
      case 'all':
        this.songsDisplayed = this.songs;
        break;

      case 'known':
        this.songsDisplayed = this.songsKnown;
        break;

      case 'unknown':
        this.songsDisplayed = this.songsUnknown;
        break;
    }
  }
}
