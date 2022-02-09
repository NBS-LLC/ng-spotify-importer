class TestDataManager {
    private constructor() { }
    private static instance: TestDataManager;
    private playlistNames: string[] = [];

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    public addPlaylistName(playlistName: string) {
        this.playlistNames.push(playlistName);
    }

    public getPlaylistNames(): string[] {
        return this.playlistNames;
    }

    public resetTestData() {
        this.playlistNames = [];
    }
}

export const testDataManager = TestDataManager.getInstance();
