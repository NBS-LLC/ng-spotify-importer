import { version } from '../../../package.json';

class Config {
    getSpotifyAuthTokenPrimary(): string {
        return this.getEnvVar('SPOTIFY_AUTH_TOKEN_PRIMARY');
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

    getEnvVar(name: string): string {
        if (name in process.env) {
            return process.env[name];
        }

        throw new Error(`The environment variable: ${name}, is not defined.`);
    }
}

export default new Config();
