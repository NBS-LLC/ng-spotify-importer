import assert from 'node:assert/strict';

import { SpotifyClient } from './spotify-client';

describe('SpotifyClient', () => {
  describe('#getAccessToken()', () => {
    it.skip('should return a valid acccess token (TODO: Mock depdencies.)', async () => {
      const spotifyClient = await SpotifyClient.getInstance();
      const accessToken = await spotifyClient.getAccessToken();
      assert(accessToken.length > 0);
    });
  });

  describe('#getPlaylistDetailsById()', () => {
    it.skip('should return playlist details for a given playlist id (TODO: Mock depdencies.)', async () => {
      const spotifyClient = await SpotifyClient.getInstance();
      const playlistDetails = await spotifyClient.getPlaylistDetailsById('5ag2PxDhgA0IXOU6Y2RGht');
      assert.strictEqual(playlistDetails.body.name, 'NGSI Unit Test - 1642447167531');
      assert.strictEqual(playlistDetails.body.description, 'Dont Delete');
      assert.strictEqual(playlistDetails.body.tracks.total, 57);
    });
  });
});
