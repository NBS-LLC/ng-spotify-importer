import config from '../support/config';

suite('deployment configuration tests', function () {
  suite('staging', function () {
    test('grant link', async function () {
      await browser.url('https://stg.nickwanders.com/projects/ng-spotify-importer/');
      const grantUrl = await $('[data-testid="grant-link"]').getAttribute('href');
      expect(grantUrl).toContain('client_id=75be9215050a42a1907c7dcf53b0e199');
      expect(grantUrl).toContain('redirect_uri=http://stg.nickwanders.com/projects/ng-spotify-importer/');
    });

    test('release link', async function () {
      await browser.url('https://stg.nickwanders.com/projects/ng-spotify-importer/');
      const releaseLinkText = await $('[data-testid="release-link"]').getText();
      expect(releaseLinkText).toContain(config.getAppVersion());
      const releaseUrl = await $('[data-testid="release-link"]').getAttribute('href');
      expect(releaseUrl).toContain(
        'https://github.com/NBS-LLC/ng-spotify-importer/releases/tag/v' + config.getAppVersion()
      );
    });
  });
});
