import assert = require("assert")
import { SpotifyClient } from "./spotify-client";

describe('SpotifyClient', () => {
    describe('#getAccessToken()', () => {
        it.skip('should return a valid acccess token (TODO: Mock depdencies.)', async () => {
            const spotifyClient = new SpotifyClient();
            const accessToken = await spotifyClient.getAccessToken();
            assert(accessToken.length > 0);
        });
    });
});