import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, Subject, takeUntil } from 'rxjs';
import { throwError } from 'rxjs';
import { RequestDetailResponse, ResultRequestDetail } from '@interfaces/index';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class RequestDetailService {
    private readonly baseUrl: string = environment.backendApiUrl;
    private http = inject(HttpClient);

    private cancelRequest$ = new Subject<void>();

    /**
     * Fetches the request details for a given request number.
     * @param {string} requestNumber - The number of the request to fetch details for.
     * @returns {Observable<ResultRequestDetail>} An observable containing the request details.
     */
    public getRequestDetails (requestNumber: string): Observable<ResultRequestDetail> {
        const url = `${this.baseUrl}/procesos/consultar_datos_solicitud/${requestNumber}`;
        return this.http.get<RequestDetailResponse>(url).pipe(
            takeUntil(this.cancelRequest$),
            map(({ results }) => results![0]),
            catchError(error => throwError(() => error.error.detail)),
        );
    } 

    /**
     * Cancels any ongoing HTTP request made by this service.
     */
    public cancelRequests (): void {
        this.cancelRequest$.next();
    }
}
