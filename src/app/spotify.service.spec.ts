import {async, TestBed} from '@angular/core/testing';

import {SpotifyService} from './spotify.service';
import {HttpClientModule} from '@angular/common/http';

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    }).compileComponents();
    service = TestBed.inject(SpotifyService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
