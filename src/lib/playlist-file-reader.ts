export function readPlaylist(playlist: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = (readerEvent) => {
            if (typeof readerEvent.target.result === 'string') {
                resolve(readerEvent.target.result.split(',')[1]);
            }
        };

        fileReader.onerror = reject;

        fileReader.readAsDataURL(playlist);
    });
}
