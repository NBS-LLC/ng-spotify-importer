export function fileToString(path: string): string {
    const fs = require('fs');

    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        console.error(err)
    }
}