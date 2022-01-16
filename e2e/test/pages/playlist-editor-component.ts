class PlaylistEditorComponent {
    get componentElement() {
        return $('<app-playlist-editor />');
    }

    get playlistImportElement() {
        return $('#playlist-import');
    }

    get allSongsLabelElement() {
        return $("//label[@for='song-data-filter-all']");
    }

    get knownSongsLabelElement() {
        return $("//label[@for='song-data-filter-known']");
    }

    get playlistNameElement() {
        return $('#playlist-name');
    }

    async importPlaylist(name: string = null) {
        if (name) {
            await this.playlistNameElement.setValue(name);
        }

        await this.playlistImportElement.click();
    }

    async waitForDisplayed() {
        return await this.componentElement.waitForDisplayed();
    }
}

export default new PlaylistEditorComponent();