import { Component, OnInit, ViewChild } from '@angular/core';
import * as appInfo from './app-info';
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
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = `NG Spotify Importer`;
  version = appInfo.version;
  projectUrl = 'https://github.com/NBS-LLC/ng-spotify-importer';
  releaseUrl = null;
  showPlaylistLoader = false;
  playlist: Playlist;
  songs: Song[] = [];
  songsLoaded = { count: 0 };

  @ViewChild(FileReaderComponent)
  fileReader: FileReaderComponent;

  @ViewChild(PlaylistEditorComponent)
  playlistEditor: PlaylistEditorComponent;

  constructor(
    private spotifyService: SpotifyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (!this.isLocalBuild()) {
      this.releaseUrl = `${this.projectUrl}/releases/tag/v${this.version}`;
    }

    this.spotifyService.onAuthChange.subscribe((isAuthenticated) => {
      this.showPlaylistLoader = isAuthenticated;
    });
  }

  onFileRead(playlist: { contents: string; name: string; type: string }) {
    switch (playlist.type) {
      case 'csv': {
        try {
          this.playlist = new CsvPlaylist(playlist.contents, playlist.name);
        } catch (e) {
          this.notificationService.error('' + e);
          throw e;
        }
        break;
      }

      case 'slacker': {
        try {
          this.playlist = new SlackerPlaylist(playlist.contents);
        } catch (e) {
          this.notificationService.error('' + e);
          throw e;
        }
        break;
      }
    }

    this.songs = this.playlist.getSongs();

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

  private isLocalBuild(): boolean {
    const localBuildTags = ['@APP_VERSION@', '0.0.0'];
    return localBuildTags.includes(this.version);
  }
}
