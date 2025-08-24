class FileReaderComponent {
  get componentElement() {
    return $('<app-file-reader />');
  }

  get fileTypeCSVElement() {
    return $('#file-type-csv');
  }

  get fileTypeSlackerElement() {
    return $('#file-type-slacker');
  }

  get fileInputElement() {
    return $('#file-input');
  }

  get loadingProgressElement() {
    return $('#playlist-load-progress');
  }

  async uploadSlackerPlaylist(localPath: string) {
    const remotePath = await browser.uploadFile(localPath);

    await this.fileTypeSlackerElement.click();
    await this.fileInputElement.setValue(remotePath);
  }

  async uploadTextPlaylist(localPath: string) {
    const remotePath = await browser.uploadFile(localPath);

    await this.fileTypeCSVElement.click();
    await this.fileInputElement.setValue(remotePath);
  }

  async uploadCSVPlaylist(localPath: string) {
    return await this.uploadTextPlaylist(localPath);
  }

  async waitForPlaylistToLoad() {
    return await browser.waitUntil(async () => {
      const max = await this.loadingProgressElement.getAttribute('max');
      const value = await this.loadingProgressElement.getAttribute('value');
      return value === max;
    });
  }

  async waitForDisplayed() {
    return await this.componentElement.waitForDisplayed();
  }
}

export default new FileReaderComponent();
