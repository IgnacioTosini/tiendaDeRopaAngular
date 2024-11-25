import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideServerRendering(),
    provideHttpClient(withFetch()),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
