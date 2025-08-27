import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, throwError, Subject, takeUntil } from 'rxjs';
import { ResponseRequestHistory } from '@interfaces/index';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class RequestHistoryService {
    private readonly baseUrl: string = environment.backendApiUrl;
    private http = inject(HttpClient);

    private cancelRequest$ = new Subject<void>();

    public responseRequestHistory = signal<ResponseRequestHistory | null>(null);

    /**
     * Fetches the request history with cancellation support.
     * @param {number} page - The page number to fetch.
     * @returns {Observable<ResponseRequestHistory>} An observable of the request history response.
     */
    public getRequestHistory (page?: number): Observable<ResponseRequestHistory> {
        let url = `${this.baseUrl}/procesos/historial-solicitud`;
        if (page !== undefined && page !== null) {
            url += `?page=${page}`;
        }

        return this.http.get<ResponseRequestHistory>(url).pipe(
            takeUntil(this.cancelRequest$),
            map(response => {
                this.responseRequestHistory.set(response);
                return response;
            }),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * Cancels any ongoing HTTP request made by this service.
     */
    public cancelRequests (): void {
        this.cancelRequest$.next();
    }
}
