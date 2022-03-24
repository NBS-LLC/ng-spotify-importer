import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {SpotifyAuthComponent} from './spotify-auth/spotify-auth.component';
import {PlaylistEditorComponent} from './playlist-editor/playlist-editor.component';
import {FileReaderComponent} from './file-reader/file-reader.component';
import {FormsModule} from '@angular/forms';
import {NotificationComponent} from './notification/notification.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SongDetailsComponent} from './song-details/song-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import SpotifyWebApi from 'spotify-web-api-js';

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
