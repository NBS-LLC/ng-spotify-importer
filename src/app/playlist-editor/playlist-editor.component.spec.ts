import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Playlist } from '../playlist';
import { Song } from '../song';
import { SpotifyService } from '../spotify.service';
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

  loadMix() {
    this.songs = [
      { artist: 'Unit Test 01', title: 'Sample Song 01', uri: 'http://example.com/unit_test_01-sample_song_01' },
      { artist: 'Unit Test 02', title: 'Sample Song 02' },
      { artist: 'Unit Test 03 & Should be Removed', title: 'Sample Song 03 (Should be Removed)' }
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
  let spotifyServiceSpy: jasmine.SpyObj<SpotifyService>;

  beforeEach(() => {
    const loadSongDataSpy = jasmine.createSpyObj(SpotifyService, ['loadSongData']);

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
        { provide: SpotifyService, useValue: loadSongDataSpy }
      ]
    }).compileComponents();

    spotifyServiceSpy = TestBed.inject(SpotifyService) as jasmine.SpyObj<SpotifyService>;
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

  it('should cleanup unknown songs only', async () => {
    const testData = new MockPlaylist();
    testData.loadMix();
    component.playlist = testData;
    fixture.detectChanges();

    await component.cleanupUnknownSongs();

    expect(spotifyServiceSpy.loadSongData).toHaveBeenCalledTimes(1);
    expect(spotifyServiceSpy.loadSongData).toHaveBeenCalledWith(testData.getUnknownSongs());
    expect(component.playlist.getSongs()).toEqual([
      { artist: 'Unit Test 01', title: 'Sample Song 01', uri: 'http://example.com/unit_test_01-sample_song_01' },
      { artist: 'Unit Test 02', title: 'Sample Song 02' }, // Nothing to cleanup
      { artist: 'Unit Test 03', title: 'Sample Song 03' } // Cleaned up
    ]);
  });

  it('should temporarily disable import and cleanup while cleaning up songs', () => {
    throw new Error('test not implemented');
  });
});
