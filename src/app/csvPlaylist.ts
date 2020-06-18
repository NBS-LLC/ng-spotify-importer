import {Song} from './song';
import {parse, ParseConfig, ParseResult} from 'papaparse';
import {Playlist} from './playlist';
import {decode} from 'he';

export class CsvPlaylist implements Playlist {
  static songs: Song[] = [];

  private readonly name: string;
  private readonly csv: ParseResult<unknown>;

  songDataLoaded: boolean;

  constructor(playlistCsv: string, playlistName: string) {
    CsvPlaylist.songs = [];

    const options: ParseConfig = {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.toUpperCase(),
      transform: value => decodeURIComponent(escape(decode(value))),
    };

    this.csv = parse(playlistCsv, options);
    if (!this.csv.meta.fields.includes('TITLE') || !this.csv.meta.fields.includes('ARTIST')) {
      console.log(playlistCsv);
      throw new Error('Invalid CSV Playlist');
    }

    this.name = playlistName;
  }

  getPlaylistName() {
    return this.name;
  }

  getSongs() {
    if (CsvPlaylist.songs.length === 0) {
      for (const songData of this.csv.data) {
        // tslint:disable-next-line:no-string-literal
        CsvPlaylist.songs.push({title: songData['TITLE'], artist: songData['ARTIST']});
      }
    }

    return CsvPlaylist.songs;
  }

  getKnownSongs(): Song[] {
    return CsvPlaylist.songs.filter(song => song.uri);
  }

  getUnknownSongs(): Song[] {
    return CsvPlaylist.songs.filter(song => song.uri === undefined);
  }
}
