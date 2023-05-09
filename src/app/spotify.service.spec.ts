import { HttpClientModule } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Song } from './song';
import { SpotifyService } from './spotify.service';


describe('SpotifyService', () => {
  let service: SpotifyService;
  let spotifyWebApi;

  beforeEach(waitForAsync(() => {
    spotifyWebApi = jasmine.createSpyObj('SpotifyWebApiJs', ['searchTracks']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: 'SpotifyWebApiJs', useValue: spotifyWebApi }
      ]
    }).compileComponents();
    service = TestBed.inject(SpotifyService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a code verifier for PKCE', () => {
    const code = service.generateCodeVerifier();
    expect(code.length).toEqual(56);
    expect(code).toMatch(/[0-9a-fA-F]+/);
  });

  /**
   * See the following tools:
   * - https://example-app.com/pkce
   * - https://emn178.github.io/online-tools/sha256.html
   * - https://emn178.github.io/online-tools/base64_encode.html
   */
  it('should generate a URL safe code challenge for PKCE', () => {
    const code = 'd7988a4d0d5c5d6be3a8d4424c0f227e9a2f154f5b712cc0443df02a';
    const challenge = service.generateCodeChallenge(code);

    // Base64 would normally generate: 1TzPHyyCW0Uc23/t2qSQUdQvXdsL+gmacEQm8zLTfvo= which isn't URL safe.
    expect(challenge).toEqual('1TzPHyyCW0Uc23_t2qSQUdQvXdsL-gmacEQm8zLTfvo');
  });

  /**
   * Covers https://github.com/NBS-LLC/ng-spotify-importer/issues/217
   */
  it('should search for tracks using proper query', async () => {
    spotifyWebApi.searchTracks.and.returnValue(Promise.resolve({
      tracks: {}
    }));

    const songs: Song[] = [
      { title: 'Hearts on Fire', artist: 'ILLENIUM, Dabin, Lights' },
    ];

    await service.loadSongData(songs);
    expect(spotifyWebApi.searchTracks).toHaveBeenCalledWith('Hearts on Fire artist: ILLENIUM, Dabin, Lights', { limit: 1 });
  });
});
