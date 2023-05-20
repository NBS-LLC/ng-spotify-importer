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
