import {Component, Input, OnInit} from '@angular/core';
import {SlackerPlaylist} from '../slackerPlaylist';
import {Song} from '../song';
import {SpotifyService} from '../spotify.service';

@Component({
  selector: 'app-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  styleUrls: ['./playlist-editor.component.css']
})
export class PlaylistEditorComponent implements OnInit {
  @Input() playlist: SlackerPlaylist;
  songsDisplayed: Song[];

  constructor(private spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this.songsDisplayed = this.playlist.getSongs();
  }

  handleSongFilterChange(inputEvent: Event) {
    const filter = (inputEvent.target as HTMLInputElement).value;
    switch (filter) {
      case 'all':
        this.songsDisplayed = this.playlist.getSongs();
        break;

      case 'known':
        this.songsDisplayed = this.playlist.getKnownSongs();
        break;

      case 'unknown':
        this.songsDisplayed = this.playlist.getUnknownSongs();
        break;
    }
  }

  refreshSong(song: Song) {
    this.spotifyService.loadSongData(Array.of(song));
  }

  importPlaylist() {
    this.spotifyService.loadUserId().then(userId => {
      this.spotifyService.createPlaylist(userId, this.playlist.getPlaylistName(), this.playlist.getSongs()).then(playlistId => {
        this.spotifyService.loadPlaylistTrackCount(playlistId).then(trackCount => {
          console.log(`createPlaylist: ${trackCount} tracks added`);
        });
      });
    });
  }

  reset() {
    this.songsDisplayed = this.playlist.getSongs();
  }
}