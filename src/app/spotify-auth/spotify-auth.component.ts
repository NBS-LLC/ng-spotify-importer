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
    this.authUrl = this.spotifyService.getAuthUrl('ee26bb61755e44c5b7e7a0a29c0f7ed5');
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
}
