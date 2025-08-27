import { CanActivateFn,  } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
export const checkAuthStatusGuard: CanActivateFn = () => {
    
    const authService = inject(AuthService);
    authService.checkAuthStatus().subscribe()

    return true
};
