import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);

    // Urls que no requieren token de acceso en el header
    const excludedUrls = [
        '/api/v1/usuarios/login/',
        '/api/v1/usuarios/login/refresh/',
        '/api/v1/usuarios/registrar/',
        '/api/v1/usuarios/activar/',
        '/api/v1/usuarios/solicitar-validar-cuenta/',
        '/api/v1/usuarios/recuperar-password/',
        '/api/v1/usuarios/validar-codigo-password/',
        '/api/v1/usuarios/logout/',
    ]; 

    if (excludedUrls.some(url => new URL(req.url).pathname === url)) {
        console.log('URL excluida, no se agrega Authorization:', req.url);
        return next(req);
    }

    const accessToken = authService.getAccessToken();

    if (!accessToken) {
        console.log('No se encontró un token de acceso.');
        return next(req);
    }
    console.log('Agregando encabezado Authorization:', accessToken);

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return next(authReq).pipe(
        catchError(err => {
            console.log('Error interceptado:', err.message);

            if (err.status === 401 || (err.status === 400 && err.url.includes('login/verify/'))) {
                console.log('Intentando renovar el token...');
                return authService.refreshToken().pipe(
                    switchMap(res => {
                        authService.storeTokens(res.access, authService.getRefreshToken());
                        console.log('Token renovado');
                        const newReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.access}`,
                            },
                        });
                        return next(newReq);
                    }),
                    catchError(refreshErr => {
                        console.log('Error al renovar el token:', refreshErr.message);
                        authService.logout();
                        return throwError(() => refreshErr);
                    })
                );
            }

            return throwError(() => err);
        })
    );
};
