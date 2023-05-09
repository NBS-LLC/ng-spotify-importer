export class TestDataManager {
    private constructor() { }
    private static instances: TestDataManager[] = [];
    private playlistNames: string[] = [];

    /**
     * Get a named instance of this class.
     * 
     * Note: it is important that a named instance be used when running specs
     * in parallel. Each process should have its own instance to prevent
     * conflicts. If a name is not provided a default will be used.
     */
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
