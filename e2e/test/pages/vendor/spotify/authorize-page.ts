class AuthorizePage {
    get pageElement() {
        return $("//*[@ng-controller='AuthorizeController']");
    }

    get agreeElement() {
        return $('#auth-accept');
    }

    async clickAgree() {
        await this.agreeElement.click();
    }

    async waitForDisplayed() {
        await browser.waitUntil(async () => {
            return await browser.getTitle() == 'Authorize - Spotify';
        });

        return await this.pageElement.waitForDisplayed();
    }
}

export default new AuthorizePage();