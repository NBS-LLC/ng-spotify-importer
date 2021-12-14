describe('import playlist flows', () => {
    it('simple slacker playlist', async () => {
        await browser.url('/')
        await expect(browser).toHaveTitle('NG Spotify Importer')
    })
})