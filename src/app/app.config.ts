import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptores/auth.interceptor';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
 providers:[provideBrowserGlobalErrorListeners(), provideRouter(routes, withHashLocation()), provideHttpClient(withInterceptors([authInterceptor]))]
};
