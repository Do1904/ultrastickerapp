import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app/app.component';
import { provideRouter } from '@angular/router';
import routeConfig from './app/app.routes';
import { provideHttpClient } from "@angular/common/http";
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent,
  {
    providers: [
      provideAnimations(),
      provideProtractorTestingSupport(),
      provideRouter(routeConfig),
      provideHttpClient(),
      { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
    ]
  }
).catch(err => console.error(err));