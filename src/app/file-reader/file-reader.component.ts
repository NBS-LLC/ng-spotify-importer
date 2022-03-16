import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { readPlaylist } from 'src/lib/playlist-file-reader';

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

  async handleFileInput($event: Event) {
    this.fileChanged.emit();

    const file = ($event.target as HTMLInputElement).files.item(0);
    if (file) {
      const contents = await readPlaylist(file);
      this.fileContents.emit({ contents, name: file.name, type: this.fileType });
    }
  }

  handleFileTypeChange($event: Event) {
    this.fileChanged.emit();
    this.fileInputElement.nativeElement.value = '';
    this.fileType = ($event.target as HTMLInputElement).value;
  }
}
