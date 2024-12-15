export class TestDataManager {
    private constructor() { }
    private static instances: TestDataManager[] = [];
    private playlistIds: string[] = [];

    /**
     * Get a named instance of this class.
     *
     * Note: it is important that a named instance be used when running specs
     * in parallel. Each process should have its own instance to prevent
     * conflicts.
     */
    public static getInstance(name: string): TestDataManager {
        return this.instances[name] || (this.instances[name] = new this());
    }

    public addPlaylist(playlistId: string) {
        this.playlistIds.push(playlistId);
    }

    public getPlaylistIds(): string[] {
        return this.playlistIds;
    }

    public resetTestData() {
        this.playlistIds = [];
    }
}
