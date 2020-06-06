import {Injectable} from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private spotifyWebApi = new SpotifyWebApi();
  private authenticated = false;

  constructor() {
  }

  setAccessToken(accessToken: string): void {
    this.spotifyWebApi.setAccessToken(accessToken);
    this.authenticated = true;
  }

  hasAuthenticated(): boolean {
    return this.authenticated;
  }

  getUserId(): Promise<string> {
    return new Promise<string>(resolve => {
      this.spotifyWebApi.getMe().then(data => {
        resolve(data.id);
      });
    });
  }
}
