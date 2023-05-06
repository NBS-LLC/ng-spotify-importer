import logger from "@wdio/logger";
import config from "../support/config";
import SpotifyWebApi from 'spotify-web-api-node';

const log = logger('SpotifyClient');

export class SpotifyClient {
    protected constructor(readonly spotifyApi: SpotifyWebApi) { }

    static async getInstance() {
        const spotifyApi = new SpotifyWebApi({
            clientId: config.getSpotifyClientId(),
            clientSecret: config.getSpotifyClientSecret()
        });

        const spotifyClient = new SpotifyClient(spotifyApi);
        const accessToken = await spotifyClient.getAccessToken();
        spotifyClient.spotifyApi.setAccessToken(accessToken);

        return spotifyClient;
    }

    async getAccessToken(): Promise<string> {
        try {
            const response = await this.spotifyApi.clientCredentialsGrant();
            return response.body.access_token;
        } catch (error) {
            log.error(error);
        }
    }

    async getPlaylistDetailsById(playlistId: string) {
        const response = await this.spotifyApi.getPlaylist(playlistId);
        return response;
    }
}
