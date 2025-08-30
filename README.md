# NgSlackerToSpotify

Import CSV and Slacker Radio playlists into Spotify.

## Prerequisites

- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Chrome or Chromium

## Install

Run `nvm use` and then `npm install`.

## Development server

Run `npm run start` for a dev server. Navigate to `http://127.0.0.1:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Update

Follow these steps when updating dependencies:

1. Perform a clean checkout of main
1. Ensure all automated tests pass (unit, integration, component, e2e)
1. Create a new branch
1. Update dev deps that relate to automated testing, in small batches
1. Ensure all automated tests pass
1. Update all non-Angular and non-WDIO deps, in small batches
1. Ensure all automated tests pass
1. Update all WDIO deps
1. Ensure all automated tests pass
1. Update all Angular deps (see [sub-section](#updating-angular))
1. Ensure all automated tests pass

Note: as a best practice `rm -rf node_modules/ package-lock.json` after each batch of updates.

### Updating Angular

Use Angular's update [guide](https://angular.dev/update-guide) and only update one major version at a time.

Use the following settings:

- Application complexity: `Medium`
- Other dependencies: `Angular Material`

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

Tests can be filtered via the command line, for example: `npm run e2e -- --mochaOpts.fgrep="simple slacker playlist"`

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
