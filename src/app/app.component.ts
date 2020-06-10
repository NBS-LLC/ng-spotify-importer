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
  playlist: Playlist;
  songs: Song[] = [];
  songsLoaded = {count: 0};

  constructor(public spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
  }

  handleFileInput(inputEvent: Event) {
    this.playlist = null;
    this.songs = [];
    this.songsLoaded = {count: 0};

    const files: FileList = (inputEvent.target as HTMLInputElement).files;
    if (files && files.item(0)) {
      const fileReader = new FileReader();

      fileReader.onload = (readerEvent) => {
        if (typeof readerEvent.target.result === 'string') {
          const contents = readerEvent.target.result.split(',')[1];
          this.playlist = new Playlist(atob(contents));
          this.songs = this.playlist.getSongs();

          console.log(`handleFileInput: ${this.songs.length} songs parsed`);

          this.spotifyService.loadSongData(this.songs, this.songsLoaded).then(() => {
            this.playlist.songDataLoaded = true;

            this.spotifyService.loadUserId().then(userId => {
              this.spotifyService.createPlaylist(userId, this.playlist.getPlaylistName(), this.songs).then(playlistId => {
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
}
