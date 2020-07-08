import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Song} from '../song';
import {SpotifyService} from '../spotify.service';

@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html',
  styleUrls: ['./song-details.component.css']
})
export class SongDetailsComponent implements OnInit {
  public originalSong: Song;
  public relatedSongs: Song[];

  constructor(
    private dialogRef: MatDialogRef<SongDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public song: Song,
    private spotifyService: SpotifyService) {
    this.originalSong = Object.assign({}, this.song);
  }

  ngOnInit(): void {
    this.searchForRelated();
  }

  handleSearchClick() {
    this.relatedSongs = [];
    this.searchForRelated();
  }

  handleRelatedSongClick(relatedSong: Song) {
    this.song.artist = relatedSong.artist;
    this.song.title = relatedSong.title;
    this.song.externalUrl = relatedSong.externalUrl;
    this.song.previewUrl = relatedSong.previewUrl;
    this.song.uri = relatedSong.uri;
    this.dialogRef.close();
  }

  private searchForRelated() {
    this.spotifyService.loadPageOfSongs(this.song.title, this.song.artist, 1).then(songs => {
      if (songs) {
        this.relatedSongs = songs;
      }
    });
  }

  // TODO: Handle search result paging...
}
