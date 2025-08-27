import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStatus } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';
export const isAuthenticatedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.authStatus() === AuthStatus.authenticated) {
        return true;
    }

    if (authService.authStatus() === AuthStatus.checking) {
        return false;
    }

    router.navigate(['/iniciar-sesion']);
    return false;
};
