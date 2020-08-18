import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SpotifyService} from '../spotify.service';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-spotify-auth',
  templateUrl: './spotify-auth.component.html',
  styleUrls: ['./spotify-auth.component.css']
})
export class SpotifyAuthComponent implements OnInit {
  public authUrl: string;
  public userId: string;

  private codeVerifier: string;
  private codeChallenge: string;

  constructor(private activatedRoute: ActivatedRoute, public spotifyService: SpotifyService, private http: HttpClient) {
    if (!sessionStorage.codeVerifier) {
      sessionStorage.codeVerifier = this.spotifyService.generateCodeVerifier();
    }

    (async () => {
      this.codeVerifier = sessionStorage.codeVerifier;
      this.codeChallenge = await this.spotifyService.generateCodeChallenge(this.codeVerifier);
      this.authUrl = this.generateAuthUrl();
    })();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
        const body = new HttpParams()
          .set('client_id', environment.spotify.clientId)
          .set('grant_type', 'authorization_code')
          .set('code', params.code)
          .set('redirect_uri', environment.spotify.redirectUrl)
          .set('code_verifier', this.codeVerifier);

        this.http.post('https://accounts.spotify.com/api/token', body).subscribe((data: { access_token: string }) => {
          this.spotifyService.setAccessToken(data.access_token);

          if (this.spotifyService.hasAuthenticated()) {
            this.spotifyService.loadUserId().then(userId => this.userId = userId);
          }
        });
      }
    });
  }

  generateAuthUrl(): string {
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + environment.spotify.clientId;
    url += '&scope=' + 'playlist-modify-public';
    url += '&redirect_uri=' + environment.spotify.redirectUrl;
    url += '&code_challenge_method=S256';
    url += '&code_challenge=' + this.codeChallenge;

    return url;
  }
}
