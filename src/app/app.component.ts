import {Component} from '@angular/core';
import {Song} from './song';
import {Playlist} from './playlist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Slacker to Spotify';
  playlistName = '';
  songs: Song[] = [];

  handleFileInput(inputEvent: Event) {
    const files: FileList = (inputEvent.target as HTMLInputElement).files;
    if (files && files.item(0)) {
      const fileReader = new FileReader();

      fileReader.onload = (readerEvent) => {
        if (typeof readerEvent.target.result === 'string') {
          const contents = readerEvent.target.result.split(',')[1];
          const playlist = new Playlist(atob(contents));

          this.playlistName = playlist.getPlaylistName();
          this.songs = playlist.getSongs();
        }
      };

      fileReader.readAsDataURL(files.item(0));
    }
  }
}
