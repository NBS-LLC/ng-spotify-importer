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

    it('should handle html entity characters', () => {
      const xml = `
            <?xml version="1.0" encoding="UTF-8" ?>
            <Playlist name='Example - Special Characters'>
            <description>An example playlist with special characters.</description>
            <songs>
                <song title='XXX 88' artistName='MØ'>
                </song>
                <song title='Twilight vs Breathe (&sect;)' artistName='Adam K &amp; Soha'>
                </song>
            </songs>
            </Playlist>
            `.trim();
      const playlist = new SlackerPlaylist(xml);
      const songs = playlist.getSongs();
      expect(songs[1].title).toEqual('Twilight vs Breathe (§)');
      expect(songs[1].artist).toEqual('Adam K & Soha');
    });

    it('should throw an error when XML is not valid', () => {
      const xml = 'Title,Artist\n' + 'XXX 88,MØ\n' + 'Twilight vs Breathe (&sect;),Adam K &amp; Soha';

      expect(() => {
        new SlackerPlaylist(xml);
      }).toThrowError(/Invalid Slacker Playlist/);
    });

    it('should throw an error the XML is not a Slacker playlist', () => {
      const xml = `
            <?xml version="1.0" encoding="UTF-8" ?>
            <description>An example playlist with special characters.</description>
            <songs>
                <song title='XXX 88' artistName='MØ'>
                </song>
                <song title='Twilight vs Breathe (&sect;)' artistName='Adam K &amp; Soha'>
                </song>
            </songs>
            </Playlist>
            `.trim();

      expect(() => {
        new SlackerPlaylist(xml);
      }).toThrowError(/Invalid Slacker Playlist/);
    });
  });
});
