import { Component, OnInit, ViewChild } from '@angular/core';
import { version } from '../../package.json';
import { CsvPlaylist } from './csvPlaylist';
import { FileReaderComponent } from './file-reader/file-reader.component';
import { NotificationService } from './notification/notification.service';
import { Playlist } from './playlist';
import { PlaylistEditorComponent } from './playlist-editor/playlist-editor.component';
import { SlackerPlaylist } from './slackerPlaylist';
import { Song } from './song';
import { SpotifyService } from './spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = `NG Spotify Importer (v${version})`;
  showPlaylistLoader = false;
  playlist: Playlist;
  songs: Song[] = [];
  songsLoaded = { count: 0 };

  @ViewChild(FileReaderComponent)
  private fileReader: FileReaderComponent;

  @ViewChild(PlaylistEditorComponent)
  private playlistEditor: PlaylistEditorComponent;

  constructor(private spotifyService: SpotifyService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.spotifyService.onAuthChange.subscribe(isAuthenticated => {
      this.showPlaylistLoader = isAuthenticated;
    });
  }

  onFileRead(playlist: { contents: string; name: string, type: string }) {
    switch (playlist.type) {
      case 'csv': {
        try {
          this.playlist = new CsvPlaylist(atob(playlist.contents), playlist.name);
        } catch (e) {
          this.notificationService.error('ERROR: Invalid CSV playlist.');
          throw e;
        }
        break;
      }

      case 'slacker': {
        try {
          this.playlist = new SlackerPlaylist(atob(playlist.contents));
        } catch (e) {
          this.notificationService.error('ERROR: Invalid Slacker playlist.');
          throw e;
        }
        break;
      }
    }

    this.songs = this.playlist.getSongs();

    console.log(`onFileRead: ${this.songs.length} songs parsed`);

    this.fileReader.fileInputDisabled = true;
    this.spotifyService.loadSongData(this.songs, this.songsLoaded).then(() => {
      this.playlist.songDataLoaded = true;
      this.fileReader.fileInputDisabled = false;
    });
  }

  onFileChanged() {
    if (this.playlistEditor) {
      this.songsLoaded.count = 0;
      this.playlist = null;
      this.playlistEditor.reset();
    }
  }
}
