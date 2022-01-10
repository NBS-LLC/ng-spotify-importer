import { Credentials } from "./credentials";

class Config {
    getPrimarySpotifyCredentials(): Credentials {
        return new Credentials(
            this.getEnvVar('PRIMARY_SPOTIFY_USERNAME'),
            this.getEnvVar('PRIMARY_SPOTIFY_PASSWORD')
        );
    }

    protected getEnvVar(name: string): string {
        if (name in process.env) {
            return process.env[name];
        }

        throw new Error(`The environment variable: ${name}, is not defined.`);
    }
}

export default new Config();