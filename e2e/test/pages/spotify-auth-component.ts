import { setSpotifyAuthToken } from '../support/helpers';

import authorizePage from './vendor/spotify/authorize-page';

class SpotifyAuthComponent {
  get componentElement() {
    return $('<app-spotify-auth />');
  }

  get grantElement() {
    return $('=Grant');
  }

  async grantPermissionWithCookies() {
    await this.grantElement.click();
    await setSpotifyAuthToken();
    // TODO: add user friendly error message if this fails
    await authorizePage.waitForDisplayed();
    await authorizePage.clickAgree();
  }

  async waitForDisplayed() {
    return await this.componentElement.waitForDisplayed();
  }
}

export default new SpotifyAuthComponent();
