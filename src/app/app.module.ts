import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import { SpotifyAuthComponent } from './spotify-auth/spotify-auth.component';
import { PlaylistEditorComponent } from './playlist-editor/playlist-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    SpotifyAuthComponent,
    PlaylistEditorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
