import { XMLParser } from 'fast-xml-parser';
import { decode } from 'he';
import { Playlist } from './playlist';
import { Song } from './song';

export class SlackerPlaylist implements Playlist {
  static songs: Song[] = [];

  private name: string;

  json: any;
  songDataLoaded = false;

  constructor(playlistXml: string) {
    SlackerPlaylist.songs = [];

    const options = {
      ignoreAttributes: false,
      attributeValueProcessor: (name, value, path) => decode(value),
    };

    try {
      const parser = new XMLParser(options);
      this.json = parser.parse(playlistXml);
    } catch (e) {
      throw new Error('Invalid Slacker Playlist - Unable to parse XML.');
    }

    if (!this.json.Playlist) {
      throw new Error('Invalid Slacker Playlist - Playlist element does not exist.');
    }

    this.name = this.json.Playlist['@_name'];
  }

  getPlaylistName() {
    return this.name;
  }

  setPlaylistName(name: string) {
    this.name = name;
  }

  getSongs() {
    if (SlackerPlaylist.songs.length === 0) {
      for (const songData of this.json.Playlist.songs.song) {
        SlackerPlaylist.songs.push({ title: songData['@_title'], artist: songData['@_artistName'] });
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
