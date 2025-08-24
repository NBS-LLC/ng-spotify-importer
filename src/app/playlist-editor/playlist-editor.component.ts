import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cleanupSong } from 'src/lib/song-utilities';
import { CleanupUnknownSongsHelpComponent } from '../cleanup-unknown-songs-help/cleanup-unknown-songs-help.component';
import { NotificationService } from '../notification/notification.service';
import { Playlist } from '../playlist';
import { Song } from '../song';
import { SongDetailsComponent } from '../song-details/song-details.component';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  styleUrls: ['./playlist-editor.component.css'],
  standalone: false,
})
export class PlaylistEditorComponent implements OnInit {
  @Input() playlist: Playlist;
  songsDisplayed: Song[];
  importEnabled = true;
  cleanupEnabled = true;

  constructor(
    private spotifyService: SpotifyService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

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
    this.importEnabled = false;
    this.cleanupEnabled = false;

    for (const song of this.playlist.getUnknownSongs()) {
      const cleanSong = cleanupSong(song);
      song.title = cleanSong.title;
      song.artist = cleanSong.artist;
    }

    await this.spotifyService.loadSongData(this.playlist.getUnknownSongs());

    this.cleanupEnabled = true;
    this.importEnabled = true;
  }

  refreshSong(song: Song) {
    this.spotifyService.loadSongData(Array.of(song));
  }

  importPlaylist() {
    this.spotifyService.loadUserId().then((userId) => {
      this.spotifyService
        .createPlaylist(userId, this.playlist.getPlaylistName(), this.playlist.getSongs())
        .then((playlistId) => {
          this.spotifyService.loadPlaylistTrackCount(playlistId).then((trackCount) => {
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
      data: song,
    });
  }

  openCleanupUnknownSongsHelpDialog() {
    this.dialog.open(CleanupUnknownSongsHelpComponent);
  }
}
