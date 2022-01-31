export class SongDataRowComponent {
    get moreElement() {
        return this.linkElement.$('button=more');
    }

    constructor(
        readonly titleElement: WebdriverIO.Element,
        readonly artistElement: WebdriverIO.Element,
        readonly linkElement: WebdriverIO.Element,
        readonly previewElement: WebdriverIO.Element
    ) { }

    async clickMore() {
        await this.moreElement.click();
    }
}
