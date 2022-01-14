class PlaylistEditorComponent {
    get componentElement() {
        return $('<app-playlist-editor />');
    }

    get allSongsLabelElement() {
        return $("//label[@for='song-data-filter-all']");
    }

    get knownSongsLabelElement() {
        return $("//label[@for='song-data-filter-known']");
    }

    async waitForDisplayed() {
        return await this.componentElement.waitForDisplayed();
    }
}

export default new PlaylistEditorComponent();