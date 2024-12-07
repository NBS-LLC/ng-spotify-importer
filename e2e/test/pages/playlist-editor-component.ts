import { SongDataRowComponent } from './song-data-row-component';

class PlaylistEditorComponent {
    get componentElement() {
        return $('<app-playlist-editor />');
    }

    get playlistImportElement() {
        return $('#playlist-import');
    }

    get allSongsLabelElement() {
        return $('//label[@for=\'song-data-filter-all\']');
    }

    get knownSongsLabelElement() {
        return $('//label[@for=\'song-data-filter-known\']');
    }

    get playlistNameElement() {
        return $('#playlist-name');
    }

    get songTitleElements() {
        return $$('.song-title');
    }

    get songArtistElements() {
        return $$('.song-artist');
    }

    get songLinkElements() {
        return $$('.song-link');
    }

    get songPreviewElements() {
        return $$('.song-preview');
    }

    async importPlaylist(name: string = null) {
        if (name) {
            await this.playlistNameElement.setValue(name);
        }

        await this.playlistImportElement.click();
    }

    async getSongDataRowComponentBySongTitle(title: string): Promise<SongDataRowComponent> {
        browser.waitUntil(async () => {
            return await this.songTitleElements.length > 0;
        });

        const index = (await this.getSongTitles()).indexOf(title);
        if (index < 0) {
            throw new Error(`Song titled: ${title} was not found.`);

        }

        return new SongDataRowComponent(
            await this.songTitleElements[index],
            await this.songArtistElements[index],
            await this.songLinkElements[index],
            await this.songPreviewElements[index]
        );
    }

    async waitForDisplayed() {
        return await this.componentElement.waitForDisplayed();
    }

    private async getSongTitles(): Promise<string[]> {
        return $$('.song-title > input').map(async (element) => await element.getValue());
    }
}

export default new PlaylistEditorComponent();
