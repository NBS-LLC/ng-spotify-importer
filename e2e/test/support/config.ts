import { version } from '../../../package.json';
import { Credentials } from './credentials';

class Config {
    getPrimarySpotifyCredentials(): Credentials {
        return new Credentials(
            this.getEnvVar('PRIMARY_SPOTIFY_USERNAME'),
            this.getEnvVar('PRIMARY_SPOTIFY_PASSWORD')
        );
    }

    getSpotifyClientId(): string {
        return this.getEnvVar('SPOTIFY_CLIENT_ID');
    }

    getSpotifyClientSecret(): string {
        return this.getEnvVar('SPOTIFY_CLIENT_SECRET');
    }

    getAppVersion(): string {
        return version;
    }

    protected getEnvVar(name: string): string {
        if (name in process.env) {
            return process.env[name];
        }

        throw new Error(`The environment variable: ${name}, is not defined.`);
    }
}

export default new Config();
