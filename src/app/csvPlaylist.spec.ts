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

        it('should throw an error when header is not present', () => {
            const csv =
                'XXX 88,MØ\n' +
                'Twilight vs Breathe (&sect;),Adam K &amp; Soha';

            expect(() => {
                const playlist = new CsvPlaylist(csv, 'Unit Test - CSV Playlist');
            }).toThrowError(/Invalid CSV Playlist/);
        });

        it('should handle csv with bom', () => {
            const bomChar = String.fromCharCode(0xFEFF);
            const csv =
                bomChar +
                'Title,Artist\n' +
                'XXX 88,MØ\n' +
                'Twilight vs Breathe (&sect;),Adam K &amp; Soha';

            const playlist = new CsvPlaylist(csv, 'Unit Test - CSV Playlist');
            const songs = playlist.getSongs();
            expect(songs.length).toEqual(2);
        });

        it('should handle csv with spaces', () => {
            const csv =
                'Title, Artist\n' +
                'Some Song, Some Artist';

            const playlist = new CsvPlaylist(csv, 'Unit Test - CSV With Spaces Playlist');
            const songs = playlist.getSongs();
            expect(songs.length).toEqual(1);
            expect(songs[0].title).toEqual('Some Song');
            expect(songs[0].artist).toEqual('Some Artist');
        });
    });
});
