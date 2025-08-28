import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';

import { AppComponent } from './app.component';
import { CsvPlaylist } from './csvPlaylist';
import { FileReaderComponent } from './file-reader/file-reader.component';
import { SpotifyService } from './spotify.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let spotifyServiceSpy: jasmine.SpyObj<SpotifyService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const spotifyServiceMock = jasmine.createSpyObj(SpotifyService, ['loadSongData']);
    const fileReaderMock = jasmine.createSpyObj([], ['fileInputDisabled']);
    const notificationServiceMock = jasmine.createSpyObj(NotificationService, ['error', 'setTimeout', 'info', 'reset']);
    spotifyServiceMock.onAuthChange = new BehaviorSubject<boolean>(true).asObservable();

    TestBed.configureTestingModule({
      declarations: [AppComponent, FileReaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterModule.forRoot([], {})],
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });

    spotifyServiceSpy = TestBed.inject(SpotifyService) as jasmine.SpyObj<SpotifyService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    spotifyServiceSpy.loadSongData.and.resolveTo();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.fileReader = fileReaderMock;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'NG Spotify Importer'`, () => {
    expect(component.title).toEqual('NG Spotify Importer');
  });

  it('should show an error if the song count does not match the loaded song count', async () => {
    const contents =
      'Title,Artist\n' +
      'Electric Love [Oliver Remix],BØRNS\n' +
      'XXX 88,MØ\n' +
      'Twilight vs Breathe (Jack Trades Remix),Adam K &amp; Soha\n' +
      'No Place,Rüfüs Du Sol';

    spotifyServiceSpy.loadSongData.and.callFake(async (songs, songsLoaded) => {
      songsLoaded.count = 2;
    });

    component.onFileRead({ contents, name: 'Unit Test - Mismatched Count', type: 'csv' });
    await fixture.whenStable();

    expect(notificationServiceSpy.error).toHaveBeenCalledWith(
      'Unable to process all song data. See console log for details.'
    );
  });

  it('should not show large file warning when song count is at the threshold', () => {
    const contents = 'Title,Artist\n' + 'Song 1,Artist 1\n' + 'Song 2,Artist 2';
    component.largeFileThreshold = 2;

    component.onFileRead({ contents, name: 'Unit Test - At Threshold', type: 'csv' });

    expect(component.showLargeFileWarning).toBeFalse();
  });

  it('should show large file warning when song count is over the threshold', () => {
    const contents = 'Title,Artist\n' + 'Song 1,Artist 1\n' + 'Song 2,Artist 2\n' + 'Song 3,Artist 3';
    component.largeFileThreshold = 2;

    component.onFileRead({ contents, name: 'Unit Test - Over Threshold', type: 'csv' });

    expect(component.showLargeFileWarning).toBeTrue();
  });

  it('should handle unicode slacker playlists', () => {
    const contents = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <Playlist name='Example - Special Characters'>
      <description>An example playlist with special characters.</description>
      <songs>
        <song title='Electric Love [Oliver Remix]' artistName='BØRNS'>
        </song>
        <song title='XXX 88' artistName='MØ'>
        </song>
        <song title='Twilight vs Breathe (Jack Trades Remix)' artistName='Adam K &amp; Soha'>
        </song>
        <song title='No Place' artistName='Rüfüs Du Sol'>
        </song>
      </songs>
    </Playlist>
    `.trim();

    component.onFileRead({ contents, name: 'Unit Test - Unicode Slacker Playlist', type: 'slacker' });

    const songs = spotifyServiceSpy.loadSongData.calls.mostRecent().args[0];
    expect(songs[3].artist).toEqual('Rüfüs Du Sol');
  });

  it('should handle html entities inside slacker playlists', () => {
    const contents = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <Playlist name='Example - Special Characters'>
      <description>An example playlist with special characters.</description>
      <songs>
        <song title='Electric Love [Oliver Remix]' artistName='BØRNS'>
        </song>
        <song title='XXX 88' artistName='MØ'>
        </song>
        <song title='Twilight vs Breathe (&sect;)' artistName='Adam K &amp; Soha'>
        </song>
        <song title='No Place' artistName='Rüfüs Du Sol'>
        </song>
      </songs>
    </Playlist>
    `.trim();

    component.onFileRead({ contents, name: 'Unit Test - HTML Entity Slacker Playlist', type: 'slacker' });

    const songs = spotifyServiceSpy.loadSongData.calls.mostRecent().args[0];
    expect(songs[2].title).toEqual('Twilight vs Breathe (§)');
    expect(songs[2].artist).toEqual('Adam K & Soha');
  });

  it('should handle unicode csv playlists', () => {
    const contents =
      'Title,Artist\n' +
      'Electric Love [Oliver Remix],BØRNS\n' +
      'XXX 88,MØ\n' +
      'Twilight vs Breathe (Jack Trades Remix),Adam K &amp; Soha\n' +
      'No Place,Rüfüs Du Sol';

    component.onFileRead({ contents, name: 'Unit Test - Unicode CSV Playlist', type: 'csv' });

    const songs = spotifyServiceSpy.loadSongData.calls.mostRecent().args[0];
    expect(songs[3].artist).toEqual('Rüfüs Du Sol');
  });

  it('should handle unicode csv playlists', () => {
    const contents =
      'Title,Artist\n' +
      'Electric Love [Oliver Remix],BØRNS\n' +
      'XXX 88,MØ\n' +
      'Twilight vs Breathe (&sect;),Adam K &amp; Soha\n' +
      'No Place,Rüfüs Du Sol';

    component.onFileRead({ contents, name: 'Unit Test - HTML Entity CSV Playlist', type: 'csv' });

    const songs = spotifyServiceSpy.loadSongData.calls.mostRecent().args[0];
    expect(songs[2].title).toEqual('Twilight vs Breathe (§)');
    expect(songs[2].artist).toEqual('Adam K & Soha');
  });

  describe('onFileChanged', () => {
    it('should reset the progress and playlist data', () => {
      // Arrange
      component.songs = [
        { title: 'Song 1', artist: 'Artist 1' },
        { title: 'Song 2', artist: 'Artist 2' },
      ];
      component.songsLoaded = { count: 2 };
      component.playlist = new CsvPlaylist('Title,Artist\nSong 1,Artist 1', 'test.csv');

      // Act
      component.onFileChanged();

      // Assert
      expect(component.songs).toEqual([]);
      expect(component.songsLoaded.count).toBe(0);
      expect(component.playlist).toBeNull();
    });

    it('should reset the playlist editor when it is available', () => {
      // Arrange
      const playlistEditorSpy = jasmine.createSpyObj('PlaylistEditorComponent', ['reset']);
      component.playlistEditor = playlistEditorSpy;

      // Act
      component.onFileChanged();

      // Assert
      expect(playlistEditorSpy.reset).toHaveBeenCalled();
    });
  });

  describe('Playlist Loading Progress', () => {
    it('should update progress bar and numbers as songs are loaded', async () => {
      const contents = 'Title,Artist\n' + 'Song 1,Artist 1\n' + 'Song 2,Artist 2\n' + 'Song 3,Artist 3';
      const songCount = 3;

      spotifyServiceSpy.loadSongData.and.callFake(async (songs, songsLoaded) => {
        fixture.detectChanges();
        const doc = fixture.debugElement.nativeElement;
        const progressElement: HTMLProgressElement = doc.querySelector('#playlist-load-progress');
        const progressText: HTMLElement = doc.querySelector('#playlist-load-progress-text');
        expect(progressElement).toBeInstanceOf(HTMLProgressElement);
        expect(progressText).toBeInstanceOf(HTMLElement);

        // Initial state after file is read
        expect(progressElement.value).toBe(0);
        expect(progressElement.max).toBe(songCount);
        expect(progressText.textContent.trim()).toBe(`0 / ${songCount}`);

        // Simulate loading one song
        songsLoaded.count = 1;
        fixture.detectChanges();
        expect(progressElement.value).toBe(1);
        expect(progressText.textContent.trim()).toBe(`1 / ${songCount}`);

        // Simulate loading another song
        songsLoaded.count = 2;
        fixture.detectChanges();
        expect(progressElement.value).toBe(2);
        expect(progressText.textContent.trim()).toBe(`2 / ${songCount}`);

        // Simulate loading all songs
        songsLoaded.count = 3;
        fixture.detectChanges();
        expect(progressElement.value).toBe(3);
        expect(progressText.textContent.trim()).toBe(`3 / ${songCount}`);
      });

      component.onFileRead({ contents, name: 'progress-test.csv', type: 'csv' });
      await fixture.whenStable();

      expect(spotifyServiceSpy.loadSongData).toHaveBeenCalled();
    });
  });
});
