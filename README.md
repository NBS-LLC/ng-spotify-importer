# NgSlackerToSpotify

Import CSV and Slacker Radio playlists into Spotify.

## Prerequisites

- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Chrome or Chromium

## Install

Run `nvm use` and then `npm install`.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

**Note:** Runs automatically when starting the development server.

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [WDIO](http://webdriver.io).

**Note:** The development server must be running.

Test configuration is based on the following environment variables:

- SPOTIFY_AUTH_TOKEN_PRIMARY - used to sign into Spotify and grant access
- SPOTIFY_CLIENT_ID - used to make api calls
- SPOTIFY_CLIENT_SECRET - used to make api calls

To get a Spotify Auth Token do the following:

1. Log into Spotify
1. Examine the site's cookies
1. The value of `sp_dc` is your auth token

The Spotify Client ID and Secret are located in the settings of the [development](https://developer.spotify.com/) dashboard.

## Deploy

To build and upload (aka deploy) the project:

```shell
npm run deploy
```

Deployment configuration is based on the following environment variables:

- ENVIRONMENT
- NG_SPOTIFY_IMPORTER\_\_DEPLOYMENT_HOST
- NG_SPOTIFY_IMPORTER\_\_DEPLOYMENT_USERNAME
- NG_SPOTIFY_IMPORTER\_\_DEPLOYMENT_PASSWORD
- NG_SPOTIFY_IMPORTER\_\_DEPLOYMENT_PORT
- NG_SPOTIFY_IMPORTER\_\_DEPLOYMENT_HOME_PATH
- NG_SPOTIFY_IMPORTER\_\_DEPLOYMENT_PROJECT_PATH

Note: ENVIRONMENT must match a value found in angular.json's `configurations` section.
