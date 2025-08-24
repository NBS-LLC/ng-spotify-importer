import { Song } from '../app/song';

/**
 * Removes special characters from the supplied song's title and artist name.
 *
 * @param song The song to clean.
 * @returns A copy of the song with clean data.
 */
export function cleanupSong(song: Song): Song {
  const cleanSong = { ...song };

  removeParenthesisPortion(cleanSong);
  removeAmpersandPortion(cleanSong);
  removeFeaturingPortion(cleanSong);
  removeSingleQuote(cleanSong);
  normalizeSpaces(cleanSong);

  return cleanSong;
}

function removeParenthesisPortion(song: Song) {
  song.artist = song.artist.replace(/\([^)]*\)/g, '');
  song.title = song.title.replace(/\([^)]*\)/g, '');
}

function removeAmpersandPortion(song: Song) {
  const keys = ['artist', 'title'];
  keys.forEach((key) => {
    const result = song[key].match(/([^&]+)(&.*$)/);
    if (Array.isArray(result)) {
      song[key] = result[1];
    }
  });
}

function removeFeaturingPortion(song: Song) {
  song.artist = song.artist.replace(/(feat\.|featuring).*/i, '');
  song.title = song.title.replace(/(feat\.|featuring).*/i, '');
}

function removeSingleQuote(song: Song) {
  song.artist = song.artist.replace(/'/g, '');
  song.title = song.title.replace(/'/g, '');
}

function normalizeSpaces(song: Song) {
  song.artist = song.artist.replace(/\s\s+/g, ' ').trim();
  song.title = song.title.replace(/\s\s+/g, ' ').trim();
}
