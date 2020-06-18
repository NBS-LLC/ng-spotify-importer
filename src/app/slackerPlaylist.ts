import {parse} from 'fast-xml-parser';
import {Song} from './song';
import {decode} from 'he';
import {Playlist} from './playlist';

export class SlackerPlaylist implements Playlist {
  static songs: Song[] = [];

  json: any;
  songDataLoaded = false;

  constructor(playlistXml: string) {
    SlackerPlaylist.songs = [];

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
    if (SlackerPlaylist.songs.length === 0) {
      for (const songData of this.json.Playlist.songs.song) {
        SlackerPlaylist.songs.push({title: songData['@_title'], artist: songData['@_artistName']});
      }
    }

    return SlackerPlaylist.songs;
  }

  getKnownSongs(): Song[] {
    return SlackerPlaylist.songs.filter(song => song.uri);
  }

  getUnknownSongs(): Song[] {
    return SlackerPlaylist.songs.filter(song => song.uri === undefined);
  }
}
