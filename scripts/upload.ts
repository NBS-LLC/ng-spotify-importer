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
    const files = await sftp.list(remoteHomePath);

    await sftp.end();

    console.log(files);
})();
