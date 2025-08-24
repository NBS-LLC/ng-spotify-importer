import assert from 'node:assert/strict';

import { TestDataManager } from './test-data-manager';

describe('TestDataManager', () => {
  const testDataManager = TestDataManager.getInstance('test');
  beforeEach(() => {
    testDataManager.resetTestData();
  });

  describe('#getInstance', () => {
    it('should return a different instance when different names are given', () => {
      const instance1 = TestDataManager.getInstance('unit test 1');
      const instance2 = TestDataManager.getInstance('unit test 2');
      assert.notStrictEqual(instance1, instance2);
    });

    it('should return the same instance when the same name is given', () => {
      const instance1 = TestDataManager.getInstance('unit test');
      const instance2 = TestDataManager.getInstance('unit test');
      assert.strictEqual(instance1, instance2);
    });
  });

  describe('#addPlaylistName', () => {
    it('should add a single playlist to the test data manager', () => {
      testDataManager.addPlaylist('AAAAAAAAAAAAAAAAAAAAAA');
      const playlistIds = testDataManager.getPlaylistIds();
      assert.strictEqual(playlistIds.length, 1);
    });

    it('should collect playlists', () => {
      testDataManager.addPlaylist('AAAAAAAAAAAAAAAAAAAAAA');
      testDataManager.addPlaylist('BBBBBBBBBBBBBBBBBBBBBB');
      const playlistIds = testDataManager.getPlaylistIds();
      assert.strictEqual(playlistIds.length, 2);
    });
  });

  describe('#resetTestData', () => {
    it('should remove playlists from the test data manager', () => {
      testDataManager.addPlaylist('AAAAAAAAAAAAAAAAAAAAAA');
      testDataManager.addPlaylist('BBBBBBBBBBBBBBBBBBBBBB');
      testDataManager.resetTestData();
      const playlistIds = testDataManager.getPlaylistIds();
      assert.strictEqual(playlistIds.length, 0);
    });
  });
});
