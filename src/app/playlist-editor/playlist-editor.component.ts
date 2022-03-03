import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CleanupUnknownSongsHelpComponent } from '../cleanup-unknown-songs-help/cleanup-unknown-songs-help.component';
import { NotificationService } from '../notification/notification.service';
import { Playlist } from '../playlist';
import { Song } from '../song';
import { SongDetailsComponent } from '../song-details/song-details.component';
import { SpotifyService } from '../spotify.service';

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
    private dialog: MatDialog) {
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

  async cleanupUnknownSongs() {
    // TODO: Disable the import playlist button.

    for (const song of this.playlist.getUnknownSongs()) {
      // TODO: Cleanup song titles and author names.
      // TODO: Remove demo code.
      if (song.title.includes('(')) {
        song.title = 'Twilight vs Breathe';
      }
    }

    await this.spotifyService.loadSongData(this.playlist.getUnknownSongs());

    // TODO: Enable the import playlist button.
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
    this.dialog.open(SongDetailsComponent, {
      data: song
    });
  }

  openCleanupUnknownSongsHelpDialog() {
    this.dialog.open(CleanupUnknownSongsHelpComponent);
  }
}
