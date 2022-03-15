import { SlackerPlaylist } from './slackerPlaylist';

describe('SlackerPlaylist', () => {
    describe('#getSongs', () => {
        it('should handle unicode characters', () => {
            const xml = `
            <?xml version="1.0" encoding="UTF-8" ?>
            <Playlist name='Example - Special Characters'>
            <description>An example playlist with special characters.</description>
            <songs>
                <song title='XXX 88' artistName='MØ'>
                </song>
                <song title='NØ Place' artistName='Rüfüs Du Sol'>
                </song>
            </songs>
            </Playlist>
            `.trim();
            const playlist = new SlackerPlaylist(xml);
            const songs = playlist.getSongs();
            expect(songs[1].title).toEqual('NØ Place');
            expect(songs[1].artist).toEqual('Rüfüs Du Sol');
        });
    });
});
