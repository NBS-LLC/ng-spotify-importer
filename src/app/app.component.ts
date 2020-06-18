import {Component, OnInit, ViewChild} from '@angular/core';
import {Song} from './song';
import {SlackerPlaylist} from './slackerPlaylist';
import {SpotifyService} from './spotify.service';
import {PlaylistEditorComponent} from './playlist-editor/playlist-editor.component';
import {FileReaderComponent} from './file-reader/file-reader.component';
import {CsvPlaylist} from './csvPlaylist';
import {Playlist} from './playlist';
import {NotificationService} from './notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'NG Spotify Importer';
  playlist: Playlist;
  songs: Song[] = [];
  songsLoaded = {count: 0};

  @ViewChild(FileReaderComponent)
  private fileReader: FileReaderComponent;

  @ViewChild(PlaylistEditorComponent)
  private playlistEditor: PlaylistEditorComponent;

  constructor(public spotifyService: SpotifyService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  onFileRead(playlist: { contents: string; name: string, type: string }) {
    switch (playlist.type) {
      case 'csv': {
        try {
          this.playlist = new CsvPlaylist(atob(playlist.contents), playlist.name);
        } catch (e) {
          this.notificationService.error('Invalid CSV Playlist.');
          throw e;
        }
        break;
      }

      case 'slacker': {
        try {
          this.playlist = new SlackerPlaylist(atob(playlist.contents));
        } catch (e) {
          this.notificationService.error('Invalid Slacker Playlist.');
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
