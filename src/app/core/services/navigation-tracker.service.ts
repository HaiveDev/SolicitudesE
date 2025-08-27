import { inject, Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationTrackerService {
    private router = inject(Router);
    
    private excludedUrls: string[] = ['/iniciar-sesion', '/registro', '/olvido-contrasena', '/cambiar-contrasena', '/terminos-y-condiciones', '/'];
    
    /**
     *
     */
    public constructor () {
        this.trackNavigation();
    }

    /**
     * Tracks navigation events and stores the URL in local storage if not excluded.
     */
    private trackNavigation (): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (!this.excludedUrls.includes(event.url)) {
                    localStorage.setItem('url', event.url);
                }
            }
        });
    }

    /**
     * Retrieves the last navigated URL from local storage.
     * @returns {string} The last URL or '/dashboard' if not found.
     */
    public getLastUrl (): string {
        return localStorage.getItem('url') || '/dashboard';
    }
}
