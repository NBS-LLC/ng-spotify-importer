import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import SpotifyWebApi from 'spotify-web-api-js';
import { AppComponent } from './app.component';
import { FileReaderComponent } from './file-reader/file-reader.component';
import { NotificationComponent } from './notification/notification.component';
import { PlaylistEditorComponent } from './playlist-editor/playlist-editor.component';
import { SongDetailsComponent } from './song-details/song-details.component';
import { SpotifyAuthComponent } from './spotify-auth/spotify-auth.component';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    SpotifyAuthComponent,
    PlaylistEditorComponent,
    FileReaderComponent,
    NotificationComponent,
    SongDetailsComponent
  ],
  providers: [
    { provide: 'SpotifyWebApiJs', useClass: SpotifyWebApi }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
