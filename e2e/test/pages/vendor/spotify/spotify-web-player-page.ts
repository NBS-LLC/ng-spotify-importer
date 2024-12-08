import { setSpotifyAuthToken } from '../../../support/helpers';

class SpotifyWebPlayerPage {
    async open() {
        await browser.url('https://open.spotify.com/');
        await setSpotifyAuthToken();
    }

    async getAccessToken() {
        const data = await browser.executeAsync(async (done) => {
            const response = await fetch("https://open.spotify.com/get_access_token?reason=transport&productType=web_player");
            done(await response.json());
        });

        return data['accessToken'];
    }

    async waitForDisplayed() {
        await browser.waitUntil(async () => {
            return (await browser.getTitle()).includes('Spotify - Web Player');
        }, { timeoutMsg: 'SpotifyWebPlayer page did not load properly.' });
    }
}

export const spotifyWebPlayerPage = new SpotifyWebPlayerPage();
