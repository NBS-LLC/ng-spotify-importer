import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SpotifyService} from '../spotify.service';

@Component({
  selector: 'app-spotify-auth',
  templateUrl: './spotify-auth.component.html',
  styleUrls: ['./spotify-auth.component.css']
})
export class SpotifyAuthComponent implements OnInit {
  public authUrl: string;
  public userId: string;

  constructor(private activatedRoute: ActivatedRoute, public spotifyService: SpotifyService) {
    this.authUrl = this.generateSpotifyAuthUrl();
  }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(hash => {
      if (hash) {
        const accessToken = (new URLSearchParams(hash)).get('access_token');
        this.spotifyService.setAccessToken(accessToken);
      }

      if (this.spotifyService.hasAuthenticated()) {
        this.spotifyService.loadUserId().then(userId => this.userId = userId);
      }
    });
  }

  generateSpotifyAuthUrl(): string {
    const clientId = 'ee26bb61755e44c5b7e7a0a29c0f7ed5';
    const scope = 'user-read-private user-read-email playlist-modify-public';
    const redirectUrl = 'http://localhost:4200/';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(clientId);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirectUrl);

    return url;
  }
}
