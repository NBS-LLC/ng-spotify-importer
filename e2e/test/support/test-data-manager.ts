export class TestDataManager {
    private constructor() { }
    private static instances: TestDataManager[] = [];
    private playlistNames: string[] = [];

    public static getInstance(name: string = 'default') {
        return this.instances[name] || (this.instances[name] = new this());
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
