import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import SpotifyWebApi from 'spotify-web-api-js';

import { SpotifyAuthComponent } from './spotify-auth.component';

describe('SpotifyAuthComponent', () => {
  let component: SpotifyAuthComponent;
  let fixture: ComponentFixture<SpotifyAuthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SpotifyAuthComponent],
      imports: [RouterModule.forRoot([], {})],
      providers: [{ provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi }, provideHttpClient(withInterceptorsFromDi())],
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
