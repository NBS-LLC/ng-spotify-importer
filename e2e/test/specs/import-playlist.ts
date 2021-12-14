import spotifyAuthComponent from "../pages/spotify-auth-component"

describe('import playlist flows', () => {
    it('simple slacker playlist', async () => {
        await browser.url('/')
        await spotifyAuthComponent.waitForDisplayed();
        await spotifyAuthComponent.grantPermissionWithCredentials('', ''); // TODO: Get creds from env var.
    })
})