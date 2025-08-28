import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import SpotifyWebApi from 'spotify-web-api-js';

import { Song } from '../song';
import { SpotifyService } from '../spotify.service';

import { SongDetailsComponent } from './song-details.component';

describe('SongDetailsComponent', () => {
  let component: SongDetailsComponent;
  let fixture: ComponentFixture<SongDetailsComponent>;
  let spotifyService: jasmine.SpyObj<SpotifyService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<SongDetailsComponent>>;

  beforeEach(waitForAsync(() => {
    const spotifyServiceSpy = jasmine.createSpyObj('SpotifyService', ['getTrackById', 'loadPageOfSongs']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [SongDetailsComponent],
      imports: [FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'test title', artist: 'test artist' } },
        { provide: SpotifyService, useValue: spotifyServiceSpy },
        { provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    spotifyService = TestBed.inject(SpotifyService) as jasmine.SpyObj<SpotifyService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<SongDetailsComponent>>;
    spotifyService.loadPageOfSongs.and.returnValue(Promise.resolve([]));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getSongBySpotifyId', () => {
    it('should call spotifyService.getTrackById with the correct id', async () => {
      const song: Song = { artist: 'Artist', title: 'Title' };
      spotifyService.getTrackById.and.returnValue(Promise.resolve(song));
      component.spotifyId = '123';

      component.getSongBySpotifyId();
      await fixture.whenStable();

      expect(spotifyService.getTrackById).toHaveBeenCalledWith('123');
    });

    it('should close the dialog when a song is found', async () => {
      const song: Song = { artist: 'Artist', title: 'Title' };
      spotifyService.getTrackById.and.returnValue(Promise.resolve(song));
      component.spotifyId = '123';

      component.getSongBySpotifyId();
      await fixture.whenStable();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should not close the dialog when a song is not found', async () => {
      spotifyService.getTrackById.and.returnValue(Promise.resolve(null));
      component.spotifyId = '123';

      component.getSongBySpotifyId();
      await fixture.whenStable();

      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });
});
