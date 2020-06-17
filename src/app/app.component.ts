import {Component, OnInit, ViewChild} from '@angular/core';
import {Song} from './song';
import {Playlist} from './playlist';
import {SpotifyService} from './spotify.service';
import {PlaylistEditorComponent} from './playlist-editor/playlist-editor.component';
import {FileReaderComponent} from './file-reader/file-reader.component';

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

  constructor(public spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
  }

  onFileRead(contents: string) {
    this.playlist = new Playlist(atob(contents));
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
