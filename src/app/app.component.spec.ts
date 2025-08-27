import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { NotificationService } from 'src/app/notification/notification.service';

import { AppComponent } from './app.component';
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
    const notificationServiceMock = jasmine.createSpyObj(NotificationService, ['error', 'setTimeout']);

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
});
