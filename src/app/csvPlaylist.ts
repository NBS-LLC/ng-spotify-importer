import {Song} from './song';
import {parse, ParseResult} from 'papaparse';
import {Playlist} from './playlist';
import {decode} from 'he';

export class CsvPlaylist implements Playlist {
  static songs: Song[] = [];

  private readonly name: string;
  private readonly csv: ParseResult<unknown>;

  songDataLoaded: boolean;

  constructor(playlistCsv: string, playlistName: string) {
    const options = {
      header: false,
      skipEmptyLines: true,
      transform: value => decodeURIComponent(escape(decode(value))),
    };

    this.csv = parse(playlistCsv, options);
    this.name = playlistName;
  }

  getPlaylistName() {
    return this.name;
  }

  getSongs() {
    if (CsvPlaylist.songs.length === 0) {
      for (const songData of this.csv.data) {
        CsvPlaylist.songs.push({title: songData[0], artist: songData[1]});
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
