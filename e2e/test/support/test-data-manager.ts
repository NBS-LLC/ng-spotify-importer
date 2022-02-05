import logger from '@wdio/logger';

const log = logger('test-data-manager');

class TestData {
    playlistNames: string[] = [];
}

class TestDataManager {
    private constructor() { }
    private static instance: TestDataManager;
    private testData: TestData = new TestData();

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    public addPlaylistName(playlistName: string) {
        this.testData.playlistNames.push(playlistName);
    }

    public getPlaylistNames(): string[] {
        return this.testData.playlistNames;
    }

    public cleanupTestData() {
        while (this.getPlaylistNames().length) {
            const playlistName = this.getPlaylistNames().pop();
            log.info(`(Dry Run) Deleting playlist: ${playlistName}.`);
        }
    }
}

export const testDataManager = TestDataManager.getInstance();
