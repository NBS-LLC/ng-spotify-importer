import assert = require("assert")
import config from "./config"

describe('Config', () => {
    describe('#getPrimarySpotifyCredentials()', () => {
        it('should throw error when username is not set', () => {
            delete process.env['PRIMARY_SPOTIFY_USERNAME'];

            assert.throws(() => {
                config.getPrimarySpotifyCredentials();
            }, { message: 'The environment variable: PRIMARY_SPOTIFY_USERNAME, is not defined.' });
        });

        it('should throw error when password is not set', () => {
            process.env['PRIMARY_SPOTIFY_USERNAME'] = 'unit';
            delete process.env['PRIMARY_SPOTIFY_PASSWORD'];

            assert.throws(() => {
                config.getPrimarySpotifyCredentials();
            }, { message: 'The environment variable: PRIMARY_SPOTIFY_PASSWORD, is not defined.' });
        });

        it('should return credentials when set', () => {
            process.env['PRIMARY_SPOTIFY_USERNAME'] = 'unit';
            process.env['PRIMARY_SPOTIFY_PASSWORD'] = 'test';

            const creds = config.getPrimarySpotifyCredentials();
            assert.strictEqual(creds.username, 'unit');
            assert.strictEqual(creds.password, 'test');
        });
    });
});