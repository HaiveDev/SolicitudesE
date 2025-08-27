import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Dropdown, ObraNewRequest } from '@interfaces/index';
import { TypeRequestService, NewRequestService } from '@services/index';
import { UtilsService } from '@shared/utils/utils.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    templateUrl: './property-info-form.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        InputTextareaModule,
        FieldsetModule,
        InputNumberModule,
        ToastModule,
    ],
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyInfoFormComponent implements OnInit, OnDestroy {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private typeRequestService = inject(TypeRequestService);
    private newRequestService = inject(NewRequestService);
    private utilsService = inject(UtilsService);

    public propertyForm!: FormGroup;
    public typeRequest!: { label: string; value: string; code: number } | null;
    public submitted: boolean = false;
    public zonesLoading = signal<boolean>(false);

    public fotoFachadaName: string | null = null;
    public fotoFachadaToUpload: File | null = null;
    public fotoFachadaErr: boolean = false;

    public archivoFacturaName: string | null = null;
    public archivoFacturaToUpload: File | null = null;
    public archivoFacturaErr: boolean = false;

    public departamentos!: Dropdown[];
    public municipios!: Dropdown[];
    public centros_poblados!: Dropdown[];
    public sectores!: Dropdown[];
    public tipoCargas!: Dropdown[];
    public usos!: Dropdown[];

    /**
     *
     */
    public ngOnInit () {
        this.typeRequest = this.typeRequestService.currentTypeRequest();

        this.propertyForm = this.formBuilder.group({
            nombre_proyecto: [''],
            direccion: ['', Validators.required],
            direccion_departamento: ['', Validators.required],
            direccion_municipio: ['', Validators.required],
            sector: ['', Validators.required],
            direccion_centro_poblado: ['', Validators.required],
            direccion_barrio: ['', Validators.required],
            latitud: ['', [Validators.required, Validators.min(1.86), Validators.max(2.93)]],
            longitud: ['', [Validators.required, Validators.min(-73.0), Validators.max(-72.0)]],
            codigo_cliente: ['', [Validators.required, Validators.min(10103065)]],
            tipo_carga: ['', Validators.required],
            uso: ['', Validators.required],
            carga_nueva: ['', Validators.required],
            carga_total: ['', Validators.required],
            medidores_existentes: ['', Validators.required],
            medidores_proyectados: [''],
            observacion: [''],
        });

        this.departamentos = this.newRequestService.departamentos;
        this.municipios = this.newRequestService.municipios;
        this.sectores = this.newRequestService.sectores;
        this.tipoCargas = this.newRequestService.tipoCargas;
        this.usos = this.newRequestService.usos;
        this.centros_poblados = this.newRequestService.centros_poblados;
        /* this.loadZones(); */

        this.configureFormForTypeRequest();

        const propertyInformation = this.newRequestService.formNewRequest().obras;
        if (propertyInformation) {
            this.configurePropertyFormValues(propertyInformation);
        }

        const fotoFachada = this.newRequestService.formNewRequest().fachada_foto;
        if (fotoFachada) {
            this.fotoFachadaToUpload = fotoFachada;
            this.fotoFachadaName = this.utilsService.truncateStringWithEllipsis(fotoFachada.name);
        }
        const archivoFactura = this.newRequestService.formNewRequest().archivo_factura;
        if (archivoFactura && (this.typeRequest?.code === 2 || this.typeRequest?.code === 3)) {
            this.archivoFacturaToUpload = archivoFactura;
            this.archivoFacturaName = this.utilsService.truncateStringWithEllipsis(archivoFactura.name);
        } else {
            this.archivoFacturaToUpload = null;
            this.archivoFacturaName = null;
        }
    }

    /**
     *
     */
    private configureFormForTypeRequest (): void {
        const fieldsToDisableForType9 = ['tipo_carga', 'carga_nueva', 'carga_total', 'medidores_existentes'];
        const fieldsToDisableForNotType3 = ['codigo_cliente'];

        // Deshabilitar campos específicos para el tipo 9
        if (this.typeRequest?.code === 9) {
            fieldsToDisableForType9.forEach(field => this.propertyForm.get(field)?.disable());
        }

        // Deshabilitar campos específicos para tipos diferentes de 3
        if (this.typeRequest?.code !== 3) {
            fieldsToDisableForNotType3.forEach(field => this.propertyForm.get(field)?.disable());
        }

        // Siempre deshabilitar "medidores_proyectados"
        this.propertyForm.get('medidores_proyectados')?.disable();
    }

    /**
     *
     * @param {ObraNewRequest} propertyInformation
     */
    private configurePropertyFormValues (propertyInformation: ObraNewRequest): void {
        const fieldsToReset = [
            'codigo_cliente',
            'carga_nueva',
            'carga_total',
            'medidores_existentes',
            'medidores_proyectados',
        ];

        this.patchFormValues(propertyInformation);

        // Resetear valores
        fieldsToReset.forEach(field => {
            if (!propertyInformation[field]) {
                this.propertyForm.get(field)?.setValue(null);
            }
        });

        // Ajustar medidores_proyectados para tipos diferentes de 9
        if (this.typeRequest?.code !== 9) {
            this.propertyForm.get('medidores_proyectados')?.setValue('1');
        }
    }

    /**
     * @param {ObraNewRequest} data
     */
    private patchFormValues (data: ObraNewRequest): void {
        // Aplica valores solo a los controles existentes en el formulario
        Object.entries(data).forEach(([key, value]) => {
            if (this.propertyForm.contains(key)) {
                this.propertyForm.get(key)?.patchValue(value);
            }
        });
    }

    /**
     * Handles the file selection event for the invoice document.
     * @param {Event} event - The file input change event.
     */
    public onarchivoFacturaSelected (event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.archivoFacturaToUpload = input.files[0];
            this.archivoFacturaName = this.utilsService.truncateStringWithEllipsis(this.archivoFacturaToUpload.name);
            this.archivoFacturaErr = false;
        } else {
            this.archivoFacturaErr = true;
            this.archivoFacturaToUpload = null;
            this.archivoFacturaName = null;
        }
    }

    /**
     * Handles the file selection event for the photo facade.
     * @param {Event} event - The file input change event.
     */
    public onFotoFachadaSelected (event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.fotoFachadaToUpload = input.files[0];
            this.fotoFachadaName = this.utilsService.truncateStringWithEllipsis(this.fotoFachadaToUpload.name);
            this.fotoFachadaErr = false;
        } else {
            this.fotoFachadaErr = true;
            this.fotoFachadaToUpload = null;
            this.fotoFachadaName = null;
        }
    }

    /**
     * Navigates to the next page.
     */
    public nextPage () {
        this.submitted = true;
        if ((this.typeRequest?.code === 2 || this.typeRequest?.code === 3) && !this.archivoFacturaToUpload) {
            this.archivoFacturaErr = true;
        }
        if (!this.fotoFachadaToUpload) {
            this.fotoFachadaErr = true;
        }
        if (this.propertyForm.invalid || this.archivoFacturaErr || this.fotoFachadaErr) {
            return;
        }

        const processedData = this.utilsService.convertFormValuesToStrings<ObraNewRequest>(
            this.propertyForm.getRawValue()
        );
        this.newRequestService.formNewRequest.set({
            ...this.newRequestService.formNewRequest(),
            obras: processedData,
        });

        this.newRequestService.formNewRequest().fachada_foto = this.fotoFachadaToUpload;
        this.newRequestService.formNewRequest().archivo_factura = this.archivoFacturaToUpload;

        this.router.navigate(['../confirmar-informacion'], { relativeTo: this.activatedRoute });
    }

    /**
     * Navigates to the previous page.
     */
    public prevPage () {
        this.router.navigate(['../informacion-personal'], { relativeTo: this.activatedRoute });
    }

    /**
     *
     */
    public ngOnDestroy (): void {
        this.newRequestService.cancelRequests();
    }
}
