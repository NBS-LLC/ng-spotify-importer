/**
 * Read the contents of a playlist file from the browser.
 *
 * @async
 * @param playlist The file usually from an HTMLInputElement
 * @returns A UTF-8 string containing the contents of the file
 */
export function readPlaylist(playlist: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (readerEvent) => {
      if (typeof readerEvent.target.result === 'string') {
        resolve(readerEvent.target.result);
      }
    };

    fileReader.onerror = reject;

    fileReader.readAsText(playlist);
  });
}
