# NgSlackerToSpotify

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Prerequisites

* Node 14 LTS - not compatibile with newer versions
* Chrome or Chromium - ensure CHROME_BIN env var is exported

Note: Chrom* must match the [version](https://www.chromium.org/getting-involved/download-chromium) of the ChromeDriver. Firewall warnings on macOS can be fixed by [signing](https://github.com/puppeteer/puppeteer/issues/4752#issuecomment-586599843) the app.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `npx ng generate component component-name` to generate a new component. You can also use `npx ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

To execute the end-to-end tests via [WDIO](http://webdriver.io):

```shell
npm run start
npm run e2e
```

Make sure to shutdown the local webserver:

```shell
fg
^C
```

## Deploy

Run `sh deploy.sh` to prepare a production deployment. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `npx ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
