import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.css']
})
export class FileReaderComponent implements OnInit {
  @Output() fileChanged = new EventEmitter();
  @Output() fileContents = new EventEmitter<{ contents: string, name: string, type: string }>();

  @ViewChild('fileInput')
  fileInputElement: ElementRef;

  fileInputDisabled = false;
  fileType = 'csv';

  constructor() {
  }

  ngOnInit(): void {
  }

  handleFileInput($event: Event) {
    this.fileChanged.emit();

    const files: FileList = ($event.target as HTMLInputElement).files;
    if (files && files.item(0)) {
      const fileReader = new FileReader();

      fileReader.onload = (readerEvent) => {
        if (typeof readerEvent.target.result === 'string') {
          const contents = readerEvent.target.result.split(',')[1];
          this.fileContents.emit({contents, name: files.item(0).name, type: this.fileType});
        }
      };

      fileReader.readAsDataURL(files.item(0));
    }
  }

  handleFileTypeChange($event: Event) {
    this.fileChanged.emit();
    this.fileInputElement.nativeElement.value = '';
    this.fileType = ($event.target as HTMLInputElement).value;
  }
}
