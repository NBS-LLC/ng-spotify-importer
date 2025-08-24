import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FileReaderComponent } from './file-reader.component';

describe('FileReaderComponent', () => {
  let component: FileReaderComponent;
  let fixture: ComponentFixture<FileReaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FileReaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
