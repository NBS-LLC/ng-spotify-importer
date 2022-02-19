import { dirname } from 'path';
import * as Client from 'ssh2-sftp-client';

const sftp = new Client('deployment-uploader');

(async () => {
    await sftp.connect({
        host: process.env.NG_SPOTIFY_IMPORTER__DEPLOYMENT_HOST,
        username: process.env.NG_SPOTIFY_IMPORTER__DEPLOYMENT_USERNAME,
        password: process.env.NG_SPOTIFY_IMPORTER__DEPLOYMENT_PASSWORD,
        port: parseInt(process.env.NG_SPOTIFY_IMPORTER__DEPLOYMENT_PORT, 10)
    });

    const remoteHomePath = process.env.NG_SPOTIFY_IMPORTER__DEPLOYMENT_HOME_PATH;
    const remoteProjectPath = remoteHomePath + '/' + process.env.NG_SPOTIFY_IMPORTER__DEPLOYMENT_PROJECT_PATH;

    try {
        await sftp.rmdir(remoteProjectPath, true);
    } catch {
        // Nothing to cleanup, so do nothing.
    }

    await sftp.mkdir(remoteProjectPath, true);

    const htaccessFilePath = dirname(__filename) + '/../dist/.htaccess';
    await sftp.fastPut(htaccessFilePath, remoteProjectPath + '/.htaccess');

    const localProjectPath = dirname(__filename) + '/../dist/ng-slacker-to-spotify/';
    await sftp.uploadDir(localProjectPath, remoteProjectPath);

    await sftp.end();
})();
