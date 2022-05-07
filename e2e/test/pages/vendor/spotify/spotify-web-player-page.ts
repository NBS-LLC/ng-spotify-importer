import { setSpotifyAuthToken } from '../../../support/helpers';

class SpotifyWebPlayerPage {
    get loginElement() {
        return $('[data-testid="login-button"]');
    }

    get libraryElements() {
        return $$('[data-testid="rootlist-item"]');
    }

    get contextMenuElement() {
        return $('#context-menu');
    }

    get contextMenuDeleteElement() {
        return this.contextMenuElement.$('span=Delete');
    }

    get deleteModalElement() {
        return $('[role="dialog"][aria-label*="Delete"]');
    }

    get deleteModalDeleteElement() {
        return this.deleteModalElement.$('div=DELETE');
    }

    get alertModalRemovedFromLibraryElement() {
        return $('[role="alert"]*=Removed');
    }

    async open() {
        await browser.url('https://open.spotify.com/');
        await setSpotifyAuthToken();
    }

    async deletePlaylistByName(playlistName: string) {
        await browser.waitUntil(async () => {
            return await this.libraryElements.length > 0;
        }, { timeoutMsg: 'No library elements found.' });

        for (const element of await this.libraryElements) {
            if (await element.getText() === playlistName) {
                await element.click({ button: 'right' });
                await this.contextMenuElement.waitForDisplayed({ timeoutMsg: 'Context menu did not display.' });
                await this.contextMenuDeleteElement.click();
                await this.deleteModalElement.waitForDisplayed({ timeoutMsg: 'Delete modal did not display.' });
                await this.deleteModalDeleteElement.click();
                await this.alertModalRemovedFromLibraryElement.waitForDisplayed(
                    { timeoutMsg: 'Removed from library alert did not display.' }
                );
                return;
            }
        }

        throw new Error(`Unable to delete: ${playlistName}.`);
    }

    async waitForDisplayed() {
        await browser.waitUntil(async () => {
            return (await browser.getTitle()).includes('Spotify - Web Player');
        }, { timeoutMsg: 'SpotifyWebPlayer page did not load properly.' });
    }
}

export const spotifyWebPlayerPage = new SpotifyWebPlayerPage();
