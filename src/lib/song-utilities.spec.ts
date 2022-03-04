import * as assert from 'assert';
import { Song } from '../app/song';
import { cleanupSong } from './song-utilities';


describe('song-utilities', () => {
    describe('cleanupSong()', () => {
        it('should remove the parenthesis part of the song title', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: '(This Should be Removed) Sample(This Too) Song Data (And This)'
            };

            const cleanSong = cleanupSong(song);

            assert.strictEqual(cleanSong.title, 'Sample Song Data');
        });

        it('should not remove anything if parenthesis do not exist', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);

            assert.strictEqual(cleanSong.title, 'Sample Song Data');
        });
    });
});
