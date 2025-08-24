export class SongDataRowComponent {
  get moreElement() {
    return this.linkElement.$('button=more');
  }

  constructor(
    readonly titleElement: ChainablePromiseElement,
    readonly artistElement: ChainablePromiseElement,
    readonly linkElement: ChainablePromiseElement,
    readonly previewElement: ChainablePromiseElement
  ) {}

  async clickMore() {
    await this.moreElement.click();
  }
}
