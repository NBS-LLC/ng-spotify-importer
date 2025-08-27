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
  showLargeFileWarning = false;
  playlistDataForWarning: { contents: string; name: string; type: string };
  largeFileThreshold = 1000;

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

  onFileRead(playlistData: { contents: string; name: string; type: string }) {
    let playlist: Playlist;
    switch (playlistData.type) {
      case 'csv': {
        try {
          playlist = new CsvPlaylist(playlistData.contents, playlistData.name);
        } catch (e) {
          this.notificationService.error('' + e);
          throw e;
        }
        break;
      }

      case 'slacker': {
        try {
          playlist = new SlackerPlaylist(playlistData.contents);
        } catch (e) {
          this.notificationService.error('' + e);
          throw e;
        }
        break;
      }
    }

    if (playlist.getSongs().length > this.largeFileThreshold) {
      this.playlistDataForWarning = playlistData;
      this.showLargeFileWarning = true;
      return;
    }

    this.processPlaylist(playlist);
  }

  processPlaylist(playlist: Playlist) {
    this.playlist = playlist;
    this.songs = this.playlist.getSongs();

    this.fileReader.fileInputDisabled = true;
    this.spotifyService.loadSongData(this.songs, this.songsLoaded).then(() => {
      if (this.songs.length != this.songsLoaded.count) {
        this.notificationService.setTimeout(60);
        this.notificationService.error('Unable to process all song data. See console log for details.');
        this.notificationService.setTimeout(5);
      }

      this.playlist.songDataLoaded = true;
      this.fileReader.fileInputDisabled = false;
    });
  }

  proceedWithLargeImport() {
    this.showLargeFileWarning = false;
    let playlist: Playlist;
    switch (this.playlistDataForWarning.type) {
      case 'csv': {
        playlist = new CsvPlaylist(this.playlistDataForWarning.contents, this.playlistDataForWarning.name);
        break;
      }
      case 'slacker': {
        playlist = new SlackerPlaylist(this.playlistDataForWarning.contents);
        break;
      }
    }
    this.processPlaylist(playlist);
  }

  cancelLargeImport() {
    this.showLargeFileWarning = false;
    this.fileReader.clearFileInput();
    this.notificationService.info('Processing canceled. Please select a new file.');
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
