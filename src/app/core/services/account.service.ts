/* eslint-disable @typescript-eslint/no-explicit-any */ //TODO: Remove this when possible and replace with specific types
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, throwError, map, Subject, takeUntil, Observable } from 'rxjs';

interface UpdateProfilePayload {
    phone: string;
    first_name: string;
    last_name: string;
}

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private readonly baseUrl = environment.backendApiUrl;
    private http = inject(HttpClient);
    private cancelRequest$ = new Subject<void>();

    public response = signal<any | null>(null); // puedes personalizar la interfaz según respuesta real

    /**
     * Cambia el correo electrónico del usuario.
     * @param {string} nuevo_email
     * @returns {Observable<any>}
     * @description Permite al usuario cambiar su correo electrónico actual por uno nuevo.
     */
    public changeEmail (nuevo_email: string): Observable<any> {
        const url = `${this.baseUrl}/usuarios/cambiar-email/`;
        return this.http.post(url, { nuevo_email }).pipe(
            takeUntil(this.cancelRequest$),
            map(response => {
                this.response.set(response);
                return response;
            }),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Confirma el nuevo correo electrónico mediante código de verificación.
     * @param {string} codigo
     * @returns {Observable<any>}
     * @description Permite al usuario confirmar su nuevo correo electrónico utilizando un código de verificación
     */
    public confirmEmail (codigo: string): Observable<any> {
        const url = `${this.baseUrl}/usuarios/confirmar-email/`;
        return this.http.post(url, { codigo }).pipe(
            takeUntil(this.cancelRequest$),
            map(response => {
                this.response.set(response);
                return response;
            }),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Cambia la contraseña del usuario.
     * @param {string} password_actual
     * @param {string} nuevo_password
     * @returns {Observable<any>}
     * @description Permite al usuario cambiar su contraseña actual por una nueva.
     * @description Permite al usuario cambiar su contraseña actual por una nueva.
     */
    public changePassword (password_actual: string, nuevo_password: string): Observable<any> {
        const url = `${this.baseUrl}/usuarios/cambiar-password/`;
        return this.http.post(url, { password_actual, nuevo_password }).pipe(
            takeUntil(this.cancelRequest$),
            map(response => {
                this.response.set(response);
                return response;
            }),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Actualiza los datos personales del usuario.
     * @param {UpdateProfilePayload} data
     * @returns {Observable<any>}
     * @description Permite actualizar el número de teléfono y los nombres del usuario.
     */
    public updateProfile (data: UpdateProfilePayload): Observable<any> {
        const url = `${this.baseUrl}/usuarios/actualizar-datos/`;
        return this.http.put(url, data).pipe(
            takeUntil(this.cancelRequest$),
            map(response => {
                this.response.set(response);
                return response;
            }),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Cancela todas las solicitudes activas.
     */
    public cancelRequests (): void {
        this.cancelRequest$.next();
    }
}
