import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { environment } from '@env/environment';

import { LoginResponse, User, AuthStatus, RefreshResponse, RegisterResponse, VerifyAccountResponse, ResendCodeResponse } from '../interfaces';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly baseUrl: string = environment.backendApiUrl;
    private http = inject(HttpClient);
        private router = inject(Router);

    private _currentUser = signal<User | null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    public currentUser = computed(() => this._currentUser());
    public authStatus = computed(() => this._authStatus());

    /**
     * Logs in the user with the provided username and password.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Observable<boolean>} - An observable that emits a boolean indicating the success of the login.
     */
    public login (username: string, password: string): Observable<boolean> {
        const url = `${this.baseUrl}/usuarios/login/`;
        const body = { username, password };

        return this.http.post<LoginResponse>(url, body).pipe(
            tap(response => {
                this.storeTokens(response.access, response.refresh);
            }),
            switchMap(() => this.checkAuthStatus()), // Verifica el estado después de iniciar sesión
            map(() => true),
            catchError(err => {
                this._authStatus.set(AuthStatus.notAuthenticated);
                return throwError(() => err.error.detail || 'Error desconocido  durante la autenticación');
            })
        );
    }

    /**
     * Registers a new user with the provided information.
     * @param {string} username - The username of the user.
     * @param {string} first_name - The first name of the user.
     * @param {string} last_name - The last name of the user.
     * @param {string} email - The email of the user.
     * @param {string} phone - The phone number of the user.
     * @param {string} password - The password of the user.
     * @returns {Observable<boolean>} - An observable that emits a boolean indicating the success of the registration.
     */
    public register (username: string, first_name: string, last_name: string, email: string, phone: string, password: string): Observable<boolean> {
        const url = `${this.baseUrl}/usuarios/registrar/`;
        const body = { username, first_name, last_name, email, phone, password };

        return this.http.post<RegisterResponse>(url, body).pipe(
            tap(response => {
                console.log('Respuesta del registro:', response);
                return response.mensaje;
            }),
            map(() => true),
            catchError(err => {
                console.log('Error en el registro:', err.error);
                return throwError(() => err.error.message || 'Error desconocido durante el registro');
            })
        );
    }

    /**
     * Verifies the account of the user with the provided code and username.
     * @param {string} codigo - The code of the user.
     * @param {string} username - The username of the user.
     * @returns {Observable<boolean>} - An observable that emits a boolean indicating the success of the verification.
     */
    public verifyAccount (codigo: string, username: string): Observable<boolean> {
        const url = `${this.baseUrl}/usuarios/activar/`;
        const body = { codigo, username };
        return this.http.post<VerifyAccountResponse>(url, body).pipe(
            tap(response => {
                console.log('Respuesta de la verificación de la cuenta:', response);
                return response.mensaje;
            }),
            map(() => true),
            catchError(err => {
                return throwError(() => err.error.message || 'Error desconocido durante la verificación de la cuenta');
            })
        );  
    }
    
    /**
     * Resends the verification code to the user.
     *
     * @param {string} username
     * @returns {Observable<boolean>} - An observable that emits true if the code was resent successfully, false otherwise.
     */
    public resendCode (username: string): Observable<boolean> {
        const url = `${this.baseUrl}/usuarios/solicitar-validar-cuenta/`;
        const body = { username };
        return this.http.post<ResendCodeResponse>(url, body).pipe(
            tap(response => {
                console.log('Respuesta del reenvío de código:', response);
                return response.mensaje;
            }),
            map(() => true),
            catchError(err => {
                return throwError(() => err.error.message || 'Error desconocido durante el reenvío de código');
            })
        );
    }

    /**
     * Checks the authentication status of the user.
     * Verifies the access token and updates the current user and status.
     * @returns {Observable<boolean>} - An observable that emits true if authenticated, false otherwise.
     */
    public checkAuthStatus (): Observable<boolean> {

        const url = `${this.baseUrl}/usuarios/login/verify/`;
        console.log('Verificando token en:', url);
        return this.http.post<User[]>(url,{ }).pipe(
            tap(user => {
                console.log('Token válido. Usuario autenticado:', user[0]);
                this._currentUser.set(user[0]);
                this._authStatus.set(AuthStatus.authenticated);
            }),
            map(() => true),
            catchError(err => {
                console.log('Token inválido o expirado:', err.message);
                return of(false);
            })
        );
    }

    /**
     * Refreshes the authentication token using the refresh token.
     * @returns {Observable<RefreshResponse>} - An observable that emits the new tokens.
     */
    public refreshToken (): Observable<RefreshResponse> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            return throwError(() => new Error('No se encontró un token de refresco'));  
        }

        const body = { refresh: refreshToken }; 

        const url = `${this.baseUrl}/usuarios/login/refresh/`;
        return this.http.post<RefreshResponse>(url, body).pipe(
            tap(response => {
                this.storeTokens(response.access, refreshToken);
            })  
        );
    }

    /**
     * Retrieves the authentication token from local storage.
     * @returns {string} - The authentication token.
     */
    public getAccessToken (): string {
        console.log('Obteniendo accessToken desde auth.service');
        return localStorage.getItem('accessToken') || '';
    }

    /**
     * Retrieves the refresh token from local storage.
     * @returns {string} - The refresh token.
     */
    public getRefreshToken (): string {
        console.log('Obteniendo refreshToken desde auth.service');
        return localStorage.getItem('refreshToken') || '';
    }

    /**
     * Stores the tokens in localStorage for later use.
     * @param {string} accessToken - The access token.
     * @param {string} refreshToken - The refresh token.
     */
    public storeTokens (accessToken: string, refreshToken: string): void {
        console.log('Guardando tokens desde auth.service');
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    /**
     * Logs out the current user, clearing the tokens and state.
     */
    public logout (): void {
        console.log('⚠️ Se ejecuta el logout');
        
        const refreshToken = this.getRefreshToken();
        const url = `${this.baseUrl}/usuarios/logout/`;
        this.http.post(url, { refresh: refreshToken }).subscribe({
            next: () => {
                console.log('Logout exitoso');
                this.router.navigate(['/iniciar-sesion']);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                this._currentUser.set(null);
                this._authStatus.set(AuthStatus.notAuthenticated);
            },
            error: (error) => {
                console.error('Error al cerrar sesión:', error);
            }
        });
    }

    /**
     * Logs out the user from all sessions.
     */
    public logoutAllSessions (): void {
        console.log('⚠️ Se ejecuta el logout de todas las sesiones');
        
        const url = `${this.baseUrl}/usuarios/logout_all/`;
        this.http.post(url, {}).subscribe({
            next: () => {
                console.log('Logout de todas las sesiones exitoso');
                this.router.navigate(['/iniciar-sesion']);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                this._currentUser.set(null);
                this._authStatus.set(AuthStatus.notAuthenticated);
            },
            error: (error) => {
                console.error('Error al cerrar sesión en todas las sesiones:', error);
            }
        });
    }
}
