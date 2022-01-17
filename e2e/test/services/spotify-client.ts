import logger from "@wdio/logger";
import config from "../support/config";
import SpotifyWebApi = require('spotify-web-api-node');

const log = logger('SpotifyClient');

export class SpotifyClient {
    constructor(private spotifyApi?: SpotifyWebApi) {
        this.spotifyApi = spotifyApi ? spotifyApi : new SpotifyWebApi({
            clientId: config.getSpotifyClientId(),
            clientSecret: config.getSpotifyClientSecret()
        });
    }

    async getAccessToken(): Promise<string> {
        try {
            const response = await this.spotifyApi.clientCredentialsGrant();
            return response.body.access_token;
        } catch (error) {
            log.error(error);
        }
    }
}