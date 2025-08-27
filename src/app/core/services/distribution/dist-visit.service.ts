import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { FormVisitDist } from '@interfaces/index';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';

const INITIAL_FORM_VISIT_DIST: FormVisitDist = {
    datos: {
        solicitud: '',
        fecha_visita_inicio: '',
        fecha_visita_fin: '',
        latitud_punto_instalacion: '',
        longitud_punto_instalacion: '',
        latitud_punto_conexion: '',
        longitud_punto_conexion: '',
        latitud_transformador: '',
        longitud_transformador: '',
        corriente_fecha_lectura: '',
        corriente_x: '',
        corriente_y: '',
        corriente_z: '',
        circuito: '',
        placa_transformador: '',
        tipo_transformador: '',
        potencia_transformador: '',
        nodo_poste: '',
        red_existente: '',
        tipo_red_existente: '',
        observacion: '',
    },
    fachada_foto: null,
    nodo_foto: null,
    transformador_foto: null,
};

@Injectable({
    providedIn: 'root',
})
export class DistVisitService {
    private readonly baseUrl: string = environment.backendApiUrl;
    private http = inject(HttpClient);

    private cancelRequest$ = new Subject<void>();

    public formVisitDist = signal<FormVisitDist>(INITIAL_FORM_VISIT_DIST);

    /**
     * @returns {ResponseCreateRequest}
     */
    public sendDataVisitDist () {
        const url = `${this.baseUrl}/api/solicitudes/visitar_solicitud_x/`; //TODO: cambiar url
        const formData = new FormData();
        const sectionsData = this.formVisitDist();

        for (const section in sectionsData) {
            if (section === 'fachada_foto' || section === 'nodo_foto' || section === 'transformador_foto') {
                const file = sectionsData[section];
                if (file instanceof File) {
                    formData.append(section, file);
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData.append(section, JSON.stringify((sectionsData as { [key: string]: any })[section]));
            }
        }

        formData.forEach((value, key) => {
            console.log(key + ": " + value);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.http.post<any>(url, formData)
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
        this.formVisitDist.set(INITIAL_FORM_VISIT_DIST);
    }
}
