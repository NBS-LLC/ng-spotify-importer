import { CsvPlaylist } from './csvPlaylist';

describe('CsvPlaylist', () => {
    describe('#getSongs', () => {
        it('should handle unicode characters', () => {
            const csv =
                'Title,Artist\n' +
                'XXX 88,MØ\n' +
                'NØ Place,Rüfüs Du Sol';

            const playlist = new CsvPlaylist(csv, 'Unit Test - CSV Playlist');
            const songs = playlist.getSongs();
            expect(songs[1].title).toEqual('NØ Place');
            expect(songs[1].artist).toEqual('Rüfüs Du Sol');
        });

        it('should handle html entity characters', () => {
            const csv =
                'Title,Artist\n' +
                'XXX 88,MØ\n' +
                'Twilight vs Breathe (&sect;),Adam K &amp; Soha';

            const playlist = new CsvPlaylist(csv, 'Unit Test - CSV Playlist');
            const songs = playlist.getSongs();
            expect(songs[1].title).toEqual('Twilight vs Breathe (§)');
            expect(songs[1].artist).toEqual('Adam K & Soha');
        });
    });
});
