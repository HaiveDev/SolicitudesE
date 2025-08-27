import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { FormApprovalDist } from '@interfaces/index';
import { Subject, takeUntil, map, catchError, throwError } from 'rxjs';

const INITIAL_FORM_APPROVAL_DIST: FormApprovalDist = {
    aprobaciones: {
        solicitud: '',
        cargabilidad: '',
        decision: '',
        plantilla_reporte: '',
        procedimiento: '',
        nota: '',
        observacion: '',
    }
};

@Injectable({
  providedIn: 'root'
})
export class DistApprovalService {
    private readonly baseUrl: string = environment.backendApiUrl;
    private http = inject(HttpClient);

    private cancelRequest$ = new Subject<void>();

    public formApprovalDist = signal<FormApprovalDist>(INITIAL_FORM_APPROVAL_DIST);

    /**
     * @returns {any} //TODO: cambiar interface
     */
    public sendDataApprovalDist () {
        const url = `${this.baseUrl}/api/solicitudes/aprobar_solicitud_x/`; //TODO: cambiar url
        const formData = new FormData();
        const sectionsData = this.formApprovalDist();

        for (const section in sectionsData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formData.append(section, JSON.stringify((sectionsData as { [key: string]: any })[section]));
        }

        formData.forEach((value, key) => {
            console.log(key + ": " + value);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.http.post<any>(url, formData) //TODO: cambiar interface
            .pipe(
                takeUntil(this.cancelRequest$),
                map(response => {
                    this.resetFormNewRequest();
                    return response;
                }),
                catchError(error => throwError(() => error.error.detail))
            );
    }

    /**
     * Cancels any ongoing HTTP request made by this service.
     */
    public cancelRequests (): void {
        this.cancelRequest$.next();
    }

    /**
     *
     */
    public resetFormNewRequest () {
        this.formApprovalDist.set(INITIAL_FORM_APPROVAL_DIST);
    }
    
}
