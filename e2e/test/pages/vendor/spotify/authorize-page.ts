class AuthorizePage {
    get agreeElement() {
        return $('button=Agree');
    }

    async clickAgree() {
        await this.agreeElement.click();
    }

    async waitForDisplayed() {
        await browser.waitUntil(async () => {
            return await browser.getTitle() === 'Authorize - Spotify';
        });
    }
}

export default new AuthorizePage();
