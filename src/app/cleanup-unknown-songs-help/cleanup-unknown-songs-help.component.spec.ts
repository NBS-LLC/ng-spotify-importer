import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanupUnknownSongsHelpComponent } from './cleanup-unknown-songs-help.component';

describe('CleanupUnknownSongsHelpComponent', () => {
  let component: CleanupUnknownSongsHelpComponent;
  let fixture: ComponentFixture<CleanupUnknownSongsHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CleanupUnknownSongsHelpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanupUnknownSongsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
