import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.css']
})
export class FileReaderComponent implements OnInit {
  @Output() fileChanged = new EventEmitter();
  @Output() fileContents = new EventEmitter<string>();

  @ViewChild('fileInput')
  fileInputElement: ElementRef;

  fileInputDisabled = false;

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
          this.fileContents.emit(contents);
        }
      };

      fileReader.readAsDataURL(files.item(0));
    }
  }

  handleFileTypeChange($event: Event) {
    this.fileChanged.emit();
    this.fileInputElement.nativeElement.value = '';

    const fileType = ($event.target as HTMLInputElement).value;
    switch (fileType) {
      case 'csv':
        console.log('csv playlist');
        break;

      case 'slacker':
        console.log('slacker playlist');
        break;
    }
  }
}
