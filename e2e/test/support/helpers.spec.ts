import assert = require("assert");
import { dirname } from "path";
import { fileToString } from "./helpers";

describe('helpers', () => {
    describe('fileToString()', () => {
        it('should return the contents of the specified file', () => {
            const contents = fileToString(dirname(__filename) + '/../assets/playlists/80sHitsPlaylist.xml');
            assert.strictEqual(contents.length, 19449);
        });
    });
});