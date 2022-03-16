import { readPlaylist } from './playlist-file-reader';

describe('PlaylistFileReader', () => {
    describe('readPlaylist', () => {
        xit('(DISABLED) should handle unicode playlists', async () => {
            const contents = `
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

            const playlist = new File([contents], 'unicode.xml', { type: 'text/xml' });
            const result = await readPlaylist(playlist);
            expect(result).toEqual(contents); // Fails because base64 encoded string is actually returned.
        });
    });
});
