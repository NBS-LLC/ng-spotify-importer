import assert = require('assert');
import { testDataManager } from './test-data-manager';

describe('TestDataManager', () => {
    afterEach(() => {
        testDataManager.resetTestData();
    });

    describe('#addPlaylistName', () => {
        it('should add a single playlist name to the test data manager', () => {
            testDataManager.addPlaylistName('Unit Test - 1234');
            const playlistNames = testDataManager.getPlaylistNames();
            assert.strictEqual(playlistNames.length, 1);
        });

        it('should collect playlist names', () => {
            testDataManager.addPlaylistName('Unit Test - 1111');
            testDataManager.addPlaylistName('Unit Test - 2222');
            const playlistNames = testDataManager.getPlaylistNames();
            assert.strictEqual(playlistNames.length, 2);
        });
    });

    describe('#resetTestData', () => {
        it('should remove playlist names from the test data manager', () => {
            testDataManager.addPlaylistName('Unit Test - 1111');
            testDataManager.addPlaylistName('Unit Test - 2222');
            testDataManager.resetTestData();
            const playlistNames = testDataManager.getPlaylistNames();
            assert.strictEqual(playlistNames.length, 0);
        });
    });
});
