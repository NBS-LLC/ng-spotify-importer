import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyAuthComponent } from './spotify-auth.component';


describe('SpotifyAuthComponent', () => {
  let component: SpotifyAuthComponent;
  let fixture: ComponentFixture<SpotifyAuthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([], {}),
        HttpClientModule
      ],
      declarations: [
        SpotifyAuthComponent
      ],
      providers: [
        { provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
