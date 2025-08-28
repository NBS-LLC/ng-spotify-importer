import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { Song } from './song';
import { SpotifyService } from './spotify.service';

describe('SpotifyService', () => {
  let service: SpotifyService;
  let spotifyWebApi;

  beforeEach(waitForAsync(() => {
    spotifyWebApi = jasmine.createSpyObj('SpotifyWebApiJs', ['searchTracks', 'getTrack']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: 'SpotifyWebApiJs', useValue: spotifyWebApi }, provideHttpClient(withInterceptorsFromDi())],
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

  describe('getTrackById', () => {
    it('should return a song when the track is found', async () => {
      const track = {
        artists: [{ name: 'Artist' }],
        name: 'Title',
        uri: 'spotify:track:123',
        preview_url: 'http://preview.url',
        external_urls: { spotify: 'http://spotify.url' },
      };
      spotifyWebApi.getTrack.and.returnValue(Promise.resolve(track));

      const song = await service.getTrackById('123');

      expect(song).toEqual({
        artist: 'Artist',
        title: 'Title',
        uri: 'spotify:track:123',
        previewUrl: 'http://preview.url',
        externalUrl: 'http://spotify.url',
      });
      expect(spotifyWebApi.getTrack).toHaveBeenCalledWith('123');
    });

    it('should return null when the track is not found', async () => {
      spotifyWebApi.getTrack.and.returnValue(Promise.resolve(null));

      const song = await service.getTrackById('456');

      expect(song).toBeNull();
      expect(spotifyWebApi.getTrack).toHaveBeenCalledWith('456');
    });
  });

  /**
   * Covers https://github.com/NBS-LLC/ng-spotify-importer/issues/217
   */
  it('should search for tracks using proper query', async () => {
    spotifyWebApi.searchTracks.and.returnValue(
      Promise.resolve({
        tracks: {},
      })
    );

    const songs: Song[] = [{ title: 'Hearts on Fire', artist: 'ILLENIUM, Dabin, Lights' }];

    await service.loadSongData(songs);
    expect(spotifyWebApi.searchTracks).toHaveBeenCalledWith('Hearts on Fire artist:ILLENIUM, Dabin, Lights', {
      limit: 1,
    });
  });

  /**
   * Partially covers https://github.com/NBS-LLC/ng-spotify-importer/issues/260
   */
  it('should handle search errors gracefully', async () => {
    const errorSpy = spyOn(console, 'error');
    const songs: Song[] = [
      { title: 'Song that fails', artist: 'Artist A' },
      { title: 'Song that succeeds', artist: 'Artist B' },
    ];

    const successfulTrack = {
      uri: 'spotify:track:successful',
      preview_url: 'http://preview.url',
      external_urls: { spotify: 'http://spotify.url' },
      artists: [{ name: 'Artist B' }],
      name: 'Song that succeeds',
    };

    // First call fails, second call succeeds
    spotifyWebApi.searchTracks.and.returnValues(
      Promise.reject('Spotify API error'),
      Promise.resolve({
        tracks: { items: [successfulTrack], total: 1 },
      })
    );

    await service.loadSongData(songs);

    expect(errorSpy).toHaveBeenCalled();
    expect(songs[0].uri).toBeUndefined(); // The failing song should not be updated
    expect(songs[1].uri).toEqual('spotify:track:successful'); // The successful song should be updated
  });
});
