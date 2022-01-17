import logger from "@wdio/logger";
import axios from "axios";
import config from "../support/config";

const log = logger('SpotifyClient');

export class SpotifyClient {
    async getAccessToken(): Promise<string> {
        try {
            const clientId = config.getSpotifyClientId();
            const clientSecret = config.getSpotifyClientSecret();
            const authCode = Buffer.from(clientId + ':' + clientSecret).toString('base64');
            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        'Authorization': 'Basic ' + authCode
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            log.error(error);
        }
    }
}