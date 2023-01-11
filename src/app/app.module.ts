import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpeechSynthesisModule } from '@ng-web-apis/speech';
import {
  TuiDataListModule,
  tuiIconsPathFactory,
  TUI_ICONS_PATH,
  TuiRootModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
@NgModule({
  declarations: [AppComponent, ChatComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SpeechSynthesisModule,
    TuiDataListModule,
    TuiSelectModule,
    TuiRootModule
  ],
  providers: [
/*     {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: APP_BASE_HREF,
      useValue: '',
    }, */
    {
      provide: TUI_ICONS_PATH,
      useValue: tuiIconsPathFactory('assets/taiga-ui/icons/'),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
