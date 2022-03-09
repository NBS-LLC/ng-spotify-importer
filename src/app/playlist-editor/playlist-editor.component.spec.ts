import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import SpotifyWebApi from 'spotify-web-api-js';
import { Playlist } from '../playlist';
import { Song } from '../song';
import { PlaylistEditorComponent } from './playlist-editor.component';


class MockPlaylist implements Playlist {
  playlistName: string;
  songDataLoaded = false;
  songs: Song[] = [];

  getKnownSongs(): Song[] {
    return this.getSongs().filter((song) => song?.uri != null);
  }

  getPlaylistName(): string {
    return this.playlistName;
  }

  getSongs(): Song[] {
    return this.songs;
  }

  getUnknownSongs(): Song[] {
    return this.getSongs().filter((song) => song?.uri == null);
  }

  setPlaylistName(name: string) {
    this.playlistName = name;
  }

  reset() {
    this.songDataLoaded = false;
    this.songs = [];
  }

  loadMix() {
    this.songs = [
      { artist: 'Unit Test 01', title: 'Sample Song 01', uri: 'http://example.com/unit_test_01-sample_song_01' },
      { artist: 'Unit Test 02', title: 'Sample Song 02' }
    ];

    this.songDataLoaded = true;
  }

  loadOnlyKnown() {
    this.songs = [
      { artist: 'Unit Test 01', title: 'Sample Song 01', uri: 'http://example.com/unit_test_01-sample_song_01' },
      { artist: 'Unit Test 02', title: 'Sample Song 02', uri: 'http://example.com/unit_test_02-sample_song_02' }
    ];

    this.songDataLoaded = true;
  }

  loadOnlyUnknown() {
    this.songs = [
      { artist: 'Unit Test 01', title: 'Sample Song 01' },
      { artist: 'Unit Test 02', title: 'Sample Song 02' }
    ];

    this.songDataLoaded = true;
  }
}

describe('PlaylistEditorComponent', () => {
  let component: PlaylistEditorComponent;
  let fixture: ComponentFixture<PlaylistEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        FormsModule
      ],
      declarations: [
        PlaylistEditorComponent
      ],
      providers: [
        { provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistEditorComponent);
    component = fixture.componentInstance;
    component.playlist = new MockPlaylist();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show "import playlist" as enabled when there are known songs', () => {
    const testData = new MockPlaylist();
    testData.loadMix();
    component.playlist = testData;
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const playlistImportElement: HTMLButtonElement = componentElement.querySelector('#playlist-import');
    expect(playlistImportElement).not.toBeNull();
    expect(playlistImportElement.disabled).toBeFalsy();
  });

  it('should show "import playlist" as disabled when there are no known songs', () => {
    const testData = new MockPlaylist();
    testData.loadOnlyUnknown();
    component.playlist = testData;
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const playlistImportElement: HTMLButtonElement = componentElement.querySelector('#playlist-import');
    expect(playlistImportElement).not.toBeNull();
    expect(playlistImportElement.disabled).toBeTruthy();
  });

  it('should show "cleanup unknown songs" as enabled when there are unknown songs', () => {
    const testData = new MockPlaylist();
    testData.loadMix();
    component.playlist = testData;
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const cleanupUnknownSongsElement: HTMLButtonElement = componentElement.querySelector('#playlist-cleanup-unknown-songs');
    expect(cleanupUnknownSongsElement).not.toBeNull();
    expect(cleanupUnknownSongsElement.disabled).toBeFalsy();
  });

  it('should show "cleanup unknown songs" as disabled when there are no unknown songs', () => {
    const testData = new MockPlaylist();
    testData.loadOnlyKnown();
    component.playlist = testData;
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const cleanupUnknownSongsElement: HTMLButtonElement = componentElement.querySelector('#playlist-cleanup-unknown-songs');
    expect(cleanupUnknownSongsElement).not.toBeNull();
    expect(cleanupUnknownSongsElement.disabled).toBeTruthy();
  });
});
