import {parse} from 'fast-xml-parser';
import {Song} from './song';
import {decode} from 'he';

export class Playlist {
  json: any;

  constructor(playlistXml: string) {
    const options = {
      ignoreAttributes: false,
      attrValueProcessor: (value, attrName) => decode(value),
    };

    this.json = parse(playlistXml, options);
  }

  getPlaylistName() {
    return this.json.Playlist['@_name'];
  }

  getSongs() {
    const songs = [];

    for (const songData of this.json.Playlist.songs.song) {
      const song: Song = {title: songData['@_title'], artist: songData['@_artistName']};
      songs.push(song);
    }

    return songs;
  }
}
