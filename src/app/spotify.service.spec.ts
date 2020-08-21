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

  it('should generate a code verifier', () => {
    const code = service.generateCodeVerifier();
    expect(code.length).toEqual(56);
    expect(code).toMatch(/[0-9a-fA-F]+/);
  });

  it('should generate a URL safe code challenge', (done) => {
    const code = 'd7988a4d0d5c5d6be3a8d4424c0f227e9a2f154f5b712cc0443df02a';
    service.generateCodeChallenge(code).then(challenge => {
      // Base64 would normally generate: 1TzPHyyCW0Uc23/t2qSQUdQvXdsL+gmacEQm8zLTfvo= which isn't URL safe.
      expect(challenge).toEqual('1TzPHyyCW0Uc23_t2qSQUdQvXdsL-gmacEQm8zLTfvo');
      done();
    });
  });
});
