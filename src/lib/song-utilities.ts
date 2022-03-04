import { Song } from '../app/song';

/**
 * Removes special characters from the supplied song's title and artist name.
 *
 * @param song The song to clean.
 * @returns A copy of the song with clean data.
 */
export function cleanupSong(song: Song): Song {
    const cleanSong = { ...song };

    cleanSong.title = removeParenthesisPortion(song.title);

    return cleanSong;
}

function removeParenthesisPortion(text: string) {
    return text.replace(/\([^)]*\)/g, '').trim();
}
