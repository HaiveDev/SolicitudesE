import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { Dropdown, FormAssignmentDist, UsuarioZonaDist } from '@interfaces/index';
import { catchError, map, Observable, Subject, takeUntil, throwError } from 'rxjs';

export const INITIAL_FORM_ASSIGNMENT_DIST: FormAssignmentDist = {
    asignaciones: {
        solicitud: '',
        fecha_agendamiento: '',
        jornada: '',
        tecnico1: '',
        tecnico2: '',
        tecnico3: '',
        observacion: '',
    }
};

@Injectable({
    providedIn: 'root',
})
export class DistAssignmentService {
    private readonly baseUrl: string = environment.backendApiUrl;
    private http = inject(HttpClient);

    private cancelRequest$ = new Subject<void>();

    public formAssignmentDist = signal<FormAssignmentDist>(INITIAL_FORM_ASSIGNMENT_DIST);

    public techniciansList = signal<Dropdown[] | null>(null);
    
    /**
     * Fetches the request history with cancellation support.
     * Transforms the response to match the Dropdown interface and updates the `zonas` signal.
     * @returns {Observable<UsuarioZonaDist>} An observable of the request history response.
     */
    public getTechnicalList (): Observable<UsuarioZonaDist[]> {
        const url = `${this.baseUrl}/api/solicitudes/consultar_usuarios_por_grupo/2/`;

        return this.http.get<UsuarioZonaDist[]>(url).pipe(
            takeUntil(this.cancelRequest$),
            map(response => {
                
                const dropdownData: Dropdown[] = response.map((techniciansList: UsuarioZonaDist) => {
                    
                    const zonas = techniciansList.zona.map(zona =>
                        zona.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
                    );
                    const maskedId = `${techniciansList.id.slice(0, 3)}**${techniciansList.id.slice(-3)}`;

                    return {
                        code: techniciansList.id.toString(),
                        name: techniciansList.usuario
                            .replace(/,| \([^)]*\)/g, "")
                            .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
                            .trim(),
                            subdata: zonas.length > 2
                            ? `${maskedId} - ${zonas.slice(0, 2).join(', ')} +${zonas.length - 2}`
                            : `${maskedId} - ${zonas.join(', ')}`,
                    };
                });                                               
                this.techniciansList.set(dropdownData);
                return response;
            }),
            catchError(error => throwError(() => error))
        );
    }

    /**
     * @returns {any} //TODO: cambiar interface
     */
    public createAssignment () {
        const url = `${this.baseUrl}/api/solicitudes/asignar_solicitud_x/`; //TODO: cambiar url
        const formData = new FormData();
        const sectionsData = this.formAssignmentDist();

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
        this.formAssignmentDist.set(INITIAL_FORM_ASSIGNMENT_DIST);
    }
    
}
