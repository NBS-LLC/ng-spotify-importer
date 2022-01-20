import {Component, Input, OnInit} from '@angular/core';
import {Song} from '../song';
import {SpotifyService} from '../spotify.service';
import {Playlist} from '../playlist';
import {NotificationService} from '../notification/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {SongDetailsComponent} from '../song-details/song-details.component';

@Component({
  selector: 'app-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  styleUrls: ['./playlist-editor.component.css']
})
export class PlaylistEditorComponent implements OnInit {
  @Input() playlist: Playlist;
  songsDisplayed: Song[];

  constructor(
    private spotifyService: SpotifyService,
    private notificationService: NotificationService,
    private songDetailsDialog: MatDialog) {
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
          this.notificationService.success(`SUCCESS: Playlist (${playlistId}) imported with ${trackCount} tracks.`);
        });
      });
    });
  }

  reset() {
    this.songsDisplayed = this.playlist.getSongs();
  }

  openSongDetailsDialog(song: Song) {
    this.songDetailsDialog.open(SongDetailsComponent, {
      data: song
    });
  }
}
