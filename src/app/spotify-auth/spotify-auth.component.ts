import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SpotifyService} from '../spotify.service';
import {environment} from '../../environments/environment';

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
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(environment.spotify.clientId);
    url += '&scope=' + encodeURIComponent('playlist-modify-public');
    url += '&redirect_uri=' + encodeURIComponent(environment.spotify.redirectUrl);

    return url;
  }
}
