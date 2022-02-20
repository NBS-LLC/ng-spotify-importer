class SongDetailsComponent {
    get componentElement() {
        return $('app-song-details');
    }

    get songTitleElement() {
        return $('#song-title');
    }

    get songArtistElement() {
        return $('#song-artist');
    }

    get searchElement() {
        return $('button=Search');
    }

    private get searchResultSongTitleElements() {
        return this.componentElement.$$('#song-data .song-title');
    }

    async clickSearch() {
        await this.searchElement.click();
    }

    async clickSearchResultRowByTitle(title: string) {
        await (await this.getSearchResultTitleElementBySongTitle(title)).click();
    }

    async getSearchResultSongTitleByIndex(index: number) {
        return await this.searchResultSongTitleElements[index].getText();
    }

    async waitForSearchResults() {
        await browser.waitUntil(async () => {
            return (await this.searchResultSongTitleElements).length > 0;
        });
    }

    async waitForDisplayed() {
        return await this.componentElement.waitForDisplayed();
    }

    private async getSearchResultTitleElementBySongTitle(songTitle: string) {
        for (const element of await this.searchResultSongTitleElements) {
            if (await element.getText() === songTitle) {
                return element;
            }
        }

        throw new Error(`Song titled: ${songTitle} was not found.`);
    }
}

export const songDetailsComponent = new SongDetailsComponent();
