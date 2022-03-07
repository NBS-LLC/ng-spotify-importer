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

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should not remove anything if parenthesis do not exist', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should remove the ampersand portion of the song title', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data & This Should be Removed'
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should normalize spaces', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: '\tSample  Song Data   '
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should not remove the ampersand portion if its at the beginning of the song title', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: '& (This Should &be Removed) Sample Song Data'
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: '& Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should remove the ampersand portion from the artist name', () => {
            const song: Song = {
                artist: 'Unit Test & This Should be Removed',
                title: 'Sample Song Data'
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should not remove the ampersand portion if its the start of the artist name', () => {
            const song: Song = {
                artist: '& Super Unit Test',
                title: 'Sample Song Data'
            };

            const expectedSong: Song = {
                artist: '& Super Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should remove the single quotes from the song title', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: 'Sample \'Song\' Data\''
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should remove the single quotes from the artist name', () => {
            const song: Song = {
                artist: 'Unit \'Test',
                title: 'Sample Song Data'
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should remove the feat. (featuring) portion of the song title', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data Feat. This Should be Removed'
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });

        it('should remove the featuring portion of the song title', () => {
            const song: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data Featuring This Should be Removed'
            };

            const expectedSong: Song = {
                artist: 'Unit Test',
                title: 'Sample Song Data'
            };

            const cleanSong = cleanupSong(song);
            assert.deepStrictEqual(cleanSong, expectedSong);
        });
    });
});
