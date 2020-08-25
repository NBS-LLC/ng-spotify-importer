import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpotifyAuthComponent} from './spotify-auth.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import SpotifyWebApi from 'spotify-web-api-js';

describe('SpotifyAuthComponent', () => {
  let component: SpotifyAuthComponent;
  let fixture: ComponentFixture<SpotifyAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule
      ],
      declarations: [
        SpotifyAuthComponent
      ],
      providers: [
        {provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi}
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
