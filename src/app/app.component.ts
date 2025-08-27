import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { configurePrimeNg } from '../../primengconfig';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/interfaces';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressHttp } from 'ngx-progressbar/http';
import { NavigationTrackerService } from '@services/index';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ProgressSpinnerModule, NgProgressbar, NgProgressHttp, ToastModule],
    templateUrl: './app.component.html',
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    private authService = inject(AuthService);
    private primengConfig =  inject(PrimeNGConfig);
    private navigationTracker = inject(NavigationTrackerService); //TODO mirar esta inyección, maneja el último URL visitado
    private router = inject(Router);

    /**
     * Constructor to initialize PrimeNG configuration.
     */
    public constructor () {
        this.authService.checkAuthStatus().subscribe();
        configurePrimeNg(this.primengConfig);
    }

    public finishedAuthCheck = computed<boolean>(() => {
        console.log(this.authService.authStatus());
        if (this.authService.authStatus() === AuthStatus.checking) {
            return false;
        }

        return true;
    });

    public authStatusChangedEffect = effect(() => {
        const url = localStorage.getItem('url');
        switch (this.authService.authStatus()) {
            case AuthStatus.checking:
                return;

            case AuthStatus.authenticated:
                this.router.navigateByUrl(url? url: '/');
                return;

            case AuthStatus.notAuthenticated:
                this.router.navigateByUrl('/iniciar-sesion');
                return;
        }
    });
}
