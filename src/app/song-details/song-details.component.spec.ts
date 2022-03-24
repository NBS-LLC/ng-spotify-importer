import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import SpotifyWebApi from 'spotify-web-api-js';
import { SongDetailsComponent } from './song-details.component';


describe('SongDetailsComponent', () => {
  let component: SongDetailsComponent;
  let fixture: ComponentFixture<SongDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule
      ],
      declarations: [
        SongDetailsComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
