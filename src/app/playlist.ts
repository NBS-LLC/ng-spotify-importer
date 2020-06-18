import {Song} from './song';

export interface Playlist {
  songDataLoaded: boolean;

  getPlaylistName(): string;

  getSongs(): Song[];

  getKnownSongs(): Song[];

  getUnknownSongs(): Song[];
}
