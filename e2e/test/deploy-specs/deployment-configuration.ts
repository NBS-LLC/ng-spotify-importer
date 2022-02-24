suite('deployment configuration tests', function () {
    suite('staging', function () {
        test('grant url', async function () {
            await browser.url('https://stg.nickwanders.com/projects/ng-spotify-importer/');
            const grantUrl = await $('a=Grant').getAttribute('href');
            expect(grantUrl).toContain('client_id=75be9215050a42a1907c7dcf53b0e199');
            expect(grantUrl).toContain('redirect_uri=http://stg.nickwanders.com/projects/ng-spotify-importer/');
        });
    });
});
