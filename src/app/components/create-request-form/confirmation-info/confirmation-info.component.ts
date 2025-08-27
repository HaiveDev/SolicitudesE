import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { BlockUIModule } from 'primeng/blockui';

import { Dropdown, FormNewRequest, ObraNewRequest, UsuarioSolicitanteNewRequest } from '@interfaces/index';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { NewRequestService, TypeRequestService } from '@services/index';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
    templateUrl: './confirmation-info.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        CardModule,
        MessagesModule,
        DividerModule,
        FieldsetModule,
        DropdownModule,
        InputTextareaModule,
        BlockUIModule,
        ProgressSpinnerModule,
        ToastModule,
    ],
    styles: [
        `
            ::ng-deep .p-fieldset {
                height: 100%;
            }
            ::ng-deep .p-message {
                margin-top: 0;
            }
            img {
                border-radius: var(--border-radius);
                max-width: 100%;
                height: auto;
                max-height: 250px;
            }
            .break-all-word {
                word-break: break-all;
            }
        `,
    ],
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationInfoComponent implements OnInit, OnDestroy {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private newRequestService = inject(NewRequestService);
    private typeRequestService = inject(TypeRequestService);
    private messageService = inject(MessageService);

    public jornadaForm!: FormGroup;
    public submitted: boolean = false;
    public loadingCreateRequest: boolean = false;
    public typeRequest!: { label: string; value: string; code: number } | null;

    private formNewRequestData!: FormNewRequest;
    public userData!: UsuarioSolicitanteNewRequest;
    public propertyData!: ObraNewRequest;
    public archivoId: File | null = null;
    public archivoFactura: File | null = null;
    public fotoFachada: File | null = null;
    public previewFotoFachada = signal<string | null>(null);

    public userDataTipoIdentificacion: string | null = null;
    public userDataTipoPersonaJuridica: string | null = null;
    public userDataCalidadSolicitante: string | null = null;

    public userDataDepartamento: string | null = null;
    public userDataMunicipio: string | null = null;
    public userDataSector: string | null = null;
    public userDataCentroPoblado: string | null = null;

    public propertyDataDepartamento: string | null = null;
    public propertyDataMunicipio: string | null = null;
    public propertyDataSector: string | null = null;
    public propertyDataCentroPoblado: string | null = null;

    public propertyDataTipoCarga: string | null = null;
    public propertyDataUso: string | null = null;

    public opcionesJoranadas: Dropdown[] = [
        { name: 'Mañana', code: '1' },
        { name: 'Tarde', code: '2' },
        { name: 'Sin preferencia', code: '3' },
    ];

    public semanaOptions: Dropdown[] = [
        { name: 'Día hábil entre semana', code: '1' },
        { name: 'Sábado en la mañana', code: '2' },
        { name: 'Sin preferencia', code: '3' },
    ];

    /**
     *
     */
    public ngOnInit () {
        this.typeRequest = this.typeRequestService.currentTypeRequest();
        this.formNewRequestData = this.newRequestService.formNewRequest();

        this.jornadaForm = this.formBuilder.group({
            jornada: ['', Validators.required],
            dia_semana: ['', Validators.required],
            observacion: [''],
        });

        this.userData = this.newRequestService.formNewRequest().usuarios_solicitantes;
        this.propertyData = this.newRequestService.formNewRequest().obras;
        this.archivoId = this.newRequestService.formNewRequest().archivo_documento;
        this.archivoFactura = this.newRequestService.formNewRequest().archivo_factura;
        this.fotoFachada = this.newRequestService.formNewRequest().fachada_foto;

        if (this.userData.numero_documento) {
            this.findDataUser();
        }
        if (this.propertyData.uso) {
            this.findDataProperty();
        }

        if (this.fotoFachada?.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.previewFotoFachada.set(e.target?.result as string);
            };

            reader.readAsDataURL(this.fotoFachada);
        }

        this.jornadaForm = this.formBuilder.group({
            jornada: ['', Validators.required],
            dia_semana: ['', Validators.required],
            observacion: [''],
        });
    }

    /**
     *
     */
    private findDataUser () {
        const {
            tipo_identificacion,
            tipo_persona_juridica,
            calidad_solicitante,
            direccion_departamento,
            direccion_municipio,
            direccion_centro_poblado,
            sector,
        } = this.userData;

        const {
            tipos_identificacion,
            tipos_persona_juridica,
            tipos_calidad_solicitante,
            departamentos,
            municipios,
            sectores,
            centros_poblados,
        } = this.newRequestService;

        // Obligatorios (lanzan mensaje si no existen)
        this.userDataTipoIdentificacion =
            tipos_identificacion.find(t => t.code === tipo_identificacion)?.name || 'Sin identificar';
        this.userDataCalidadSolicitante =
            tipos_calidad_solicitante.find(t => t.code === calidad_solicitante)?.name || 'Sin identificar';
        this.userDataDepartamento =
            departamentos.find(d => d.code === direccion_departamento)?.name || 'Sin identificar';
        this.userDataMunicipio = municipios.find(m => m.code === direccion_municipio)?.name || 'Sin identificar';
        this.userDataSector = sectores.find(s => s.code === sector)?.name || 'Sin identificar';
        this.userDataCentroPoblado =
            centros_poblados.find(c => c.code === direccion_centro_poblado)?.name || 'Sin identificar';

        // Opcionales (si el código está definido, se busca; si no, se deja vacío)
        this.userDataTipoPersonaJuridica = tipo_persona_juridica
            ? tipos_persona_juridica.find(t => t.code === tipo_persona_juridica)?.name || 'Sin identificar'
            : '';
    }
    /**
     *
     */
    private findDataProperty () {
        const { 
            direccion_departamento, 
            direccion_municipio, 
            direccion_centro_poblado, 
            sector, tipo_carga, uso 
        } = this.propertyData;

        const { 
            departamentos, 
            municipios, 
            sectores, 
            centros_poblados, 
            tipoCargas, usos 
        } = this.newRequestService;

        this.propertyDataDepartamento =
            departamentos.find(d => d.code === direccion_departamento)?.name || 'Sin identificar';
        this.propertyDataMunicipio = municipios.find(m => m.code === direccion_municipio)?.name || 'Sin identificar';
        this.propertyDataSector = sectores.find(s => s.code === sector)?.name || 'Sin identificar';
        this.propertyDataCentroPoblado =
            centros_poblados.find(c => c.code === direccion_centro_poblado)?.name || 'Sin identificar';
        this.propertyDataUso = usos.find(u => u.code === uso)?.name || 'Sin identificar';

        // Opcionales (si el código está definido, se busca; si no, se deja vacío)
        this.propertyDataTipoCarga = tipo_carga
            ? tipoCargas.find(t => t.code === tipo_carga)?.name || 'Sin identificar'
            : '';
    }

    /**
     * Navigate to the previous page.
     */
    public prevPage () {
        this.router.navigate(['../informacion-inmueble'], { relativeTo: this.activatedRoute });
    }
    /**
     * Navigate to informacion personal page
     */
    public completeUser () {
        this.router.navigate(['../informacion-personal'], { relativeTo: this.activatedRoute });
    }

    /**
     * Completes the form submission process.
     */
    public complete () {
        this.submitted = true;
        if (this.jornadaForm.valid && this.userData.numero_documento && this.propertyData.uso) {
            this.newRequestService.formNewRequest().solicitudes_horarios = this.jornadaForm.value;
            console.log(this.newRequestService.formNewRequest());
            this.loadingCreateRequest = true;
            this.newRequestService.createNewRequest().subscribe({
                next: () => {
                    this.loadingCreateRequest = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Solicitud creada',
                        detail: 'Se ha creado la solicitud correctamente',
                    });
                    /* this.router.navigate(['/solicitudes']); */
                },
                error: error => {
                    this.loadingCreateRequest = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    });
                },
            });
        }
    }

    /**
     *
     */
    public ngOnDestroy (): void {
        this.newRequestService.cancelRequests();
    }
}
