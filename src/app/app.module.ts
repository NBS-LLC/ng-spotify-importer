import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import { SpotifyAuthComponent } from './spotify-auth/spotify-auth.component';
import { PlaylistEditorComponent } from './playlist-editor/playlist-editor.component';
import { FileReaderComponent } from './file-reader/file-reader.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SpotifyAuthComponent,
    PlaylistEditorComponent,
    FileReaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
