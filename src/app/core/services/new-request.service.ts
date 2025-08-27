import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import {
    Dropdown,
    FormNewRequest,
    ResponseCreateRequest,
} from '@interfaces/index';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';

const INITIAL_FORM_NEW_REQUEST: FormNewRequest = {
    configuracion_solicitud: {
        tipo_solicitud: '',
        tipo_formulario: '',
        numero_solicitud: '',
        finalizado: true,
        rechazado: false,
        rechazo_observacion: '',
    },
    usuarios_solicitantes: {
        nombre: '',
        tipo_identificacion: '',
        numero_documento: '',
        fecha_expedicion: '',
        lugar_expedicion: '',
        tipo_persona_juridica: '',
        calidad_solicitante: '',
        telefono: '',
        celular1: '',
        celular2: '',
        email: '',
        direccion_departamento: '',
        direccion_municipio: '',
        sector: '',
        direccion_centro_poblado: '',
        direccion_barrio: '',
        direccion: '',
    },
    obras: {
        nombre_proyecto: '',
        direccion_departamento: '',
        direccion_municipio: '',
        sector: '',
        direccion_centro_poblado: '',
        direccion: '',
        direccion_barrio: '',
        latitud: '',
        longitud: '',
        uso: '',
        codigo_cliente: '',
        tipo_carga: '',
        carga_nueva: '',
        carga_total: '',
        medidores_existentes: '',
        medidores_proyectados: '',
        observacion: '',
    },
    solicitudes_horarios: {
        jornada: '',
        dia_semana: '',
        observacion: '',
    },
    archivo_documento: null,
    archivo_factura: null,
    fachada_foto: null,
};

@Injectable({
    providedIn: 'root',
})
export class NewRequestService {
    private readonly baseUrl: string = environment.backendApiUrl;
    private http = inject(HttpClient);

    private cancelRequest$ = new Subject<void>();

    public formNewRequest = signal<FormNewRequest>(INITIAL_FORM_NEW_REQUEST);

    public tipos_identificacion: Dropdown[] = [
        { name: 'Cédula de ciudadanía', code: '0' },
        { name: 'Cédula de extranjería', code: '1' },
        { name: 'NIT', code: '2' },
    ];

    public tipos_persona_juridica: Dropdown[] = [
        { name: 'Estatal', code: '0' },
        { name: 'Privada', code: '1' },
        { name: 'Mixta', code: '2' },
    ];
    public tipos_calidad_solicitante: Dropdown[] = [
        { name: 'Propietario', code: '1' },
        { name: 'Arrendatario', code: '2' },
        { name: 'Poseedor', code: '3' },
    ];

    public departamentos: Dropdown[] = [
        { name: 'Guaviare', code: '1' },
        { name: 'Puerto Concordia', code: '2' },
    ];

    public municipios: Dropdown[] = [
        { name: 'San José del Guaviare', code: '2' },
        { name: 'Puerto Concordia', code: '1' },
        { name: 'El retorno', code: '4' },
        { name: 'Calamar', code: '3' },
        { name: 'Miraflores', code: '5' },
    ];

    public centros_poblados: Dropdown[] = [
        { code: '50450000', name: 'Puerto Concordia' },
        { code: '50450001', name: 'El Pororio' },
        { code: '50450002', name: 'Lindenai' },
        { code: '50450003', name: 'San Fernando' },
        { code: '95001000', name: 'San Jose Del Guaviare' },
        { code: '95001001', name: 'Raudal Del Guayabero' },
        { code: '95001002', name: 'Sabanas De La Fuga' },
        { code: '95001006', name: 'Guacamayas' },
        { code: '95001009', name: 'Puerto Nuevo' },
        { code: '95001010', name: 'Puerto Arturo' },
        { code: '95001012', name: 'Cachicamo' },
        { code: '95001016', name: 'El Capricho' },
        { code: '95001017', name: 'Charras' },
        { code: '95001018', name: 'Caracol' },
        { code: '95001019', name: 'Tomachipan' },
        { code: '95001020', name: 'Mocuare' },
        { code: '95001023', name: 'La Carpa' },
        { code: '95001024', name: 'Boqueron' },
        { code: '95001027', name: 'Las Acacias' },
        { code: '95001029', name: 'Resbalon' },
        { code: '95001030', name: 'Cano Blanco Ii' },
        { code: '95001031', name: 'Cerro Azul' },
        { code: '95001032', name: 'El Diamante' },
        { code: '95001034', name: 'El Refugio' },
        { code: '95001035', name: 'El Triunfo' },
        { code: '95001036', name: 'La Esmeralda' },
        { code: '95001037', name: 'Picalojo' },
        { code: '95001039', name: 'Santo Domingo' },
        { code: '95001042', name: 'El Morro' },
        { code: '95001043', name: 'Villa Alejandra' },
        { code: '95001044', name: 'Villa Alejandra 2' },
        { code: '95001045', name: 'Miralindo' },
        { code: '95001046', name: 'La Catalina' },
        { code: '95015000', name: 'Calamar' },
        { code: '95015003', name: 'Las Damas' },
        { code: '95025000', name: 'El Retorno' },
        { code: '95025001', name: 'La Libertad' },
        { code: '95025002', name: 'El Unilla' },
        { code: '95025003', name: 'Cerritos' },
        { code: '95025004', name: 'Morichal Viejo' },
        { code: '95025005', name: 'San Lucas' },
        { code: '95025006', name: 'La Fortaleza' },
        { code: '95025010', name: 'La Paz' },
        { code: '95025011', name: 'Pueblo Nuevo' },
        { code: '95200000', name: 'Miraflores' },
        { code: '95200001', name: 'Barranquillita' },
        { code: '95200002', name: 'Lagos Del Dorado' },
        { code: '95200003', name: 'Las Pavas Cano Tigre' },
        { code: '95200004', name: 'Buenos Aires' },
        { code: '95200005', name: 'La Ye' },
        { code: '95200006', name: 'Lagos Del Paso' },
        { code: '95200009', name: 'Puerto Nare' },
        { code: '95200010', name: 'Puerto Santander' },
        { code: '95200014', name: 'La Hacienda' },
        { code: '95200015', name: 'Puerto Cordoba' },
        { code: '95200016', name: 'Puerto Mandu' },
    ];

    public sectores: Dropdown[] = [
        { name: 'Urbano', code: '1' },
        { name: 'Rural', code: '2' },
    ];

    public tipoCargas: Dropdown[] = [
        { name: 'Monofásica - 120v', code: '1' },
        { name: 'Bifásica - 120v/208v', code: '2' },
        { name: 'Trifásica - 240v/440v', code: '3' },
        { name: 'Media tensión - 13.000v', code: '4' },
    ];

    public usos: Dropdown[] = [
        { name: 'Residencial', code: '1' },
        { name: 'Comercial', code: '2' },
        { name: 'Industrial', code: '3' },
        { name: 'Oficial', code: '4' },
    ];

    /**
     * @returns {ResponseCreateRequest}
     */
    public createNewRequest () {
        const url = `${this.baseUrl}/procesos/procesar_solicitud/`;
        const formData = new FormData();
        const sectionsData = this.formNewRequest();

        for (const section in sectionsData) {
            if (section === 'archivo_documento' || section === 'archivo_factura' || section === 'fachada_foto') {
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
            console.log(key + ': ' + value);
        });

        return this.http.post<ResponseCreateRequest>(url, formData).pipe(
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
        this.formNewRequest.set(INITIAL_FORM_NEW_REQUEST);
    }
}
