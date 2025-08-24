import { cleanupSong } from './song-utilities';

describe('song-utilities', () => {
  describe('cleanupSong()', () => {
    const data = [
      {
        name: 'should remove the parenthesis portion of the song title',
        input: {
          artist: 'Unit Test',
          title: '(This Should be Removed) Sample(This Too) Song Data (And This)',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should not do anything if the song data does not contain special characters',
        input: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should remove the ampersand portion of the song title',
        input: {
          artist: 'Unit Test',
          title: 'Sample Song Data & This Should be Removed',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should normalize spaces',
        input: {
          artist: 'Unit Test',
          title: '\tSample  Song Data   ',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should not remove the ampersand portion if its at the beginning of the song title',
        input: {
          artist: 'Unit Test',
          title: '& (This Should &be Removed) Sample Song Data',
        },
        expected: {
          artist: 'Unit Test',
          title: '& Sample Song Data',
        },
      },
      {
        name: 'should remove the ampersand portion from the artist name',
        input: {
          artist: 'Unit Test & This Should be Removed',
          title: 'Sample Song Data',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should not remove the ampersand portion if its the start of the artist name',
        input: {
          artist: '& Super Unit Test',
          title: 'Sample Song Data',
        },
        expected: {
          artist: '& Super Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should remove the single quotes from the song title',
        input: {
          artist: 'Unit Test',
          title: "Sample 'Song' Data'",
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should remove the single quotes from the artist name',
        input: {
          artist: "Unit 'Test",
          title: 'Sample Song Data',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should remove the feat. (featuring) portion of the song title',
        input: {
          artist: 'Unit Test',
          title: 'Sample Song Data Feat. This Should be Removed',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should remove the featuring portion of the song title',
        input: {
          artist: 'Unit Test',
          title: 'Sample Song Data Featuring This Should be Removed',
        },
        expected: {
          artist: 'Unit Test',
          title: 'Sample Song Data',
        },
      },
      {
        name: 'should cleanup a mix of special characters',
        input: {
          artist: '&&& Unit (&) Test (& Remove &)',
          title: '(& Remove) Sample Song Data &(Remove This) Featuring This Should be Removed',
        },
        expected: {
          artist: '&&& Unit Test',
          title: 'Sample Song Data',
        },
      },
    ];

    data.forEach((testData) => {
      it(testData.name, () => {
        const cleanSong = cleanupSong(testData.input);
        expect(cleanSong).toEqual(testData.expected);
      });
    });
  });
});
