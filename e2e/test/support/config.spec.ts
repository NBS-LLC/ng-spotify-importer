import assert from 'node:assert/strict';

import config from './config';

describe('Config', () => {
  describe('#getEnvVar()', () => {
    it('should throw an error when the env var is not set', () => {
      delete process.env['CONFIG_GET_ENV_VAR_UNIT_TEST'];

      assert.throws(
        () => {
          config.getEnvVar('CONFIG_GET_ENV_VAR_UNIT_TEST');
        },
        { message: 'The environment variable: CONFIG_GET_ENV_VAR_UNIT_TEST, is not defined.' }
      );
    });

    it('should return data when the env var is set', () => {
      process.env['CONFIG_GET_ENV_VAR_UNIT_TEST'] = 'something';
      assert.strictEqual(config.getEnvVar('CONFIG_GET_ENV_VAR_UNIT_TEST'), 'something');
    });
  });
});
