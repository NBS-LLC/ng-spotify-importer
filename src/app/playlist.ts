import {parse} from 'fast-xml-parser';
import {Song} from './song';
import {decode} from 'he';

export class Playlist {
  static songs: Song[] = [];

  json: any;
  songDataLoaded = false;

  constructor(playlistXml: string) {
    Playlist.songs = [];

    const options = {
      ignoreAttributes: false,
      attrValueProcessor: value => decodeURIComponent(escape(decode(value))),
    };

    this.json = parse(playlistXml, options);
  }

  getPlaylistName() {
    return this.json.Playlist['@_name'];
  }

  getSongs() {
    if (Playlist.songs.length === 0) {
      for (const songData of this.json.Playlist.songs.song) {
        Playlist.songs.push({title: songData['@_title'], artist: songData['@_artistName']});
      }
    }

    return Playlist.songs;
  }

  getKnownSongs(): Song[] {
    return Playlist.songs.filter(song => song.uri);
  }

  getUnknownSongs(): Song[] {
    return Playlist.songs.filter(song => song.uri === undefined);
  }
}
