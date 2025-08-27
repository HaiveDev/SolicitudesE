import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { TypeRequestService } from '../services/type-request.service';

/**
 * Determines if the route can be activated based on the request type.
 * @param {ActivatedRouteSnapshot} route - The route snapshot.
 * @returns {boolean} - True if the route can be activated, false otherwise.
 */
export const typeRequestGuard: CanActivateFn = ( route: ActivatedRouteSnapshot ): boolean => {
    const typeRequestService = inject(TypeRequestService);
    const router = inject(Router);

    typeRequestService.clearTypeRequest();

    const requestType = route.params['tipo'];

    if (!typeRequestService.setTypeRequest(requestType)) {
        router.navigate(['/solicitudes']);
        return false;
    }

    return true;
};
