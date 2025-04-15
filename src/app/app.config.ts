import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {definePreset} from '@primeng/themes';
import {providePrimeNG} from 'primeng/config';
import Aura from "@primeng/themes/aura";

import {routes} from './app.routes';
import {assembleeIntereptor} from './config/http.config';

const LegalAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: LegalAura,
        options: {
          darkModeSelector: false
        }
      },
      ripple: true,
    }),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        assembleeIntereptor
      ])
    )
  ],
};
