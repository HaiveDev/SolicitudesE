import { ApplicationConfig, LOCALE_ID, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { LocationStrategy, PathLocationStrategy  } from '@angular/common';
import { progressInterceptor } from 'ngx-progressbar/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideNgProgressOptions } from 'ngx-progressbar';
import { provideRouter, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

import { authInterceptor } from '@interceptors/index';

import { registerLocales } from '../../locale.config';
registerLocales();

export const appConfig: ApplicationConfig = {

    providers: [
        // HTTP Client: Provee funcionalidad para realizar peticiones HTTP
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, progressInterceptor])),

        // Zoneless Change Detection (Experimental): Habilita la detección de cambios sin Zone.js
        provideExperimentalZonelessChangeDetection(),

        // Animations: Habilita las animaciones de Angular en toda la aplicación
        provideAnimations(),

        // Router: Configuración de rutas y características adicionales
        provideRouter(
            routes, // Define las rutas principales de la aplicación
            withViewTransitions(), // Habilita transiciones de vista (navegación más suave)
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled', // Restaura la posición del scroll al navegar
                anchorScrolling: 'enabled', // Permite desplazarse a anclas (hashes en URLs)
            }),
            withRouterConfig({
                onSameUrlNavigation: 'reload', // Recarga la ruta incluso si es la misma URL
            }),
            
        ),
        //Configuración de la barra de progreso en peticione http
        provideNgProgressOptions({
            fadeOutSpeed: 200,
        }),

        // Localización: Usa rutas con formato de Path en lugar de Hash (#)
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // Localización: Español (Colombia)
        { provide: LOCALE_ID, useValue: 'es-CO' },
    ],
};
