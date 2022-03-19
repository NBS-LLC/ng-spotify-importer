import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FileReaderComponent } from './file-reader/file-reader.component';
import { SpotifyService } from './spotify.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let spotifyServiceSpy: jasmine.SpyObj<SpotifyService>;

  beforeEach(() => {
    const spotifyServiceMock = jasmine.createSpyObj(SpotifyService, ['loadSongData']);
    const fileReaderMock = jasmine.createSpyObj([], ['fileInputDisabled']);

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        FileReaderComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceMock }
      ]
    });

    spotifyServiceSpy = TestBed.inject(SpotifyService) as jasmine.SpyObj<SpotifyService>;
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

  it('should handle unicode slacker playlists', async () => {
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

    component.onFileRead({ contents, name: 'Unit Test - Base64 XML Playlist', type: 'slacker' });

    const songs = spotifyServiceSpy.loadSongData.calls.mostRecent().args[0];
    expect(songs[3].artist).toEqual('Rüfüs Du Sol');
  });

  it('should handle html entities inside slacker playlists', async () => {
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

    component.onFileRead({ contents, name: 'Unit Test - Base64 XML Playlist', type: 'slacker' });

    const songs = spotifyServiceSpy.loadSongData.calls.mostRecent().args[0];
    expect(songs[2].title).toEqual('Twilight vs Breathe (§)');
    expect(songs[2].artist).toEqual('Adam K & Soha');
  });
});
