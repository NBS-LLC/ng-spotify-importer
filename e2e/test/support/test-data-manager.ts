export class TestDataManager {
    private constructor() { }
    private static instances: TestDataManager[] = [];
    private playlistNames: string[] = [];

    /**
     * Get a named instance of this class.
     * 
     * Note: it is important that a named instance be used when running specs
     * in parallel. Each process should have its own instance to prevent
     * conflicts.
     */
    public static getInstance(name: string) {
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
