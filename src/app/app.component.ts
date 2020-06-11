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

  onFileRead(contents: string) {
    this.playlist = new Playlist(atob(contents));
    this.songs = this.playlist.getSongs();

    console.log(`onFileRead: ${this.songs.length} songs parsed`);

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
}
