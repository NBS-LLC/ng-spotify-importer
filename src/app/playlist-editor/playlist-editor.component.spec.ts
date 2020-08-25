import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlaylistEditorComponent} from './playlist-editor.component';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {Playlist} from '../playlist';
import {Song} from '../song';
import {FormsModule} from '@angular/forms';
import SpotifyWebApi from 'spotify-web-api-js';

class MockPlaylist implements Playlist {
  songDataLoaded: boolean;

  getKnownSongs(): Song[] {
    return [];
  }

  getPlaylistName(): string {
    return '';
  }

  getSongs(): Song[] {
    return [];
  }

  getUnknownSongs(): Song[] {
    return [];
  }

  setPlaylistName(name: string) {
  }
}

describe('PlaylistEditorComponent', () => {
  let component: PlaylistEditorComponent;
  let fixture: ComponentFixture<PlaylistEditorComponent>;

  beforeEach(async(() => {
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
        {provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistEditorComponent);
    component = fixture.componentInstance;
    component.playlist = new MockPlaylist();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
