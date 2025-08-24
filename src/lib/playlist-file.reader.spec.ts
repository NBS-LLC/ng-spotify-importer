import { readPlaylist } from './playlist-file-reader';

describe('PlaylistFileReader', () => {
  describe('readPlaylist', () => {
    it('should handle unicode playlists', async () => {
      const contents = `
            <?xml version="1.0" encoding="UTF-8" ?>
            <Playlist name='Example - Special Characters'>
            <description>An example playlist with special characters.</description>
            <songs>
                <song title='Electric Love [Oliver Remix]' artistName='BØRNS'>
                </song>
                <song title='XXX 88' artistName='MØ'>
                </song>
                <song title='Twilight vs Breathe (Jack Trades Remix)' artistName='Adam K &amp; Soha'>
                </song>
                <song title='No Place' artistName='Rüfüs Du Sol'>
                </song>
            </songs>
            </Playlist>
            `.trim();

      const playlist = new File([contents], 'unicode.xml', { type: 'text/xml' });
      const result = await readPlaylist(playlist);
      expect(result).toEqual(contents);
    });
  });
});
