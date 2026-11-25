import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { tokenInterceptor } from '@core/interceptors/token.interceptor';
// Zoneless by default in Angular 22 (no zone.js); HttpClient uses fetch by default.
export const appConfig: ApplicationConfig = { providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
  provideHttpClient(withInterceptors([tokenInterceptor]))] };
