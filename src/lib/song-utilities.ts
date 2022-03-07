import { Song } from '../app/song';

/**
 * Removes special characters from the supplied song's title and artist name.
 *
 * @param song The song to clean.
 * @returns A copy of the song with clean data.
 */
export function cleanupSong(song: Song): Song {
    const cleanSong = { ...song };

    cleanSong.title = removeParenthesisPortion(cleanSong.title);
    cleanSong.title = removeAmpersandPortion(cleanSong.title);
    cleanSong.artist = removeAmpersandPortion(cleanSong.artist);
    cleanSong.title = removeSingleQuote(cleanSong.title);
    cleanSong.artist = removeSingleQuote(cleanSong.artist);
    cleanSong.title = removeFeaturingPortion(cleanSong.title);
    cleanSong.title = normalizeSpaces(cleanSong.title);

    return cleanSong;
}

function removeParenthesisPortion(text: string) {
    return text.replace(/\([^)]*\)/g, '').trim();
}

function removeAmpersandPortion(text: string) {
    const result = text.match(/(\w.*)(&.*$)/);

    if (Array.isArray(result)) {
        return result[1].trim();
    }

    return text;
}

function removeFeaturingPortion(text: string) {
    return text.replace(/(feat\.|featuring).*/i, '').trim();
}

function removeSingleQuote(text: string) {
    return text.replace(/'/g, '').trim();
}

function normalizeSpaces(text: string) {
    return text.replace(/\s\s+/g, ' ').trim();
}
