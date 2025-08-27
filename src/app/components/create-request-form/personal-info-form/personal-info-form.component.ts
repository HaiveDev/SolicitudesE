import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Dropdown, UsuarioSolicitanteNewRequest } from '@interfaces/index';
import { TypeRequestService, NewRequestService } from '@services/index';
import { UtilsService } from '@shared/utils/utils.service';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
    selector: 'app-personal-info-form',
    templateUrl: './personal-info-form.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule,
        KeyFilterModule,
    ],
})
export class PersonalInfoFormComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private breakpointObserver = inject(BreakpointObserver);
    private typeRequestService = inject(TypeRequestService);
    private newRequestService = inject(NewRequestService);
    private utilsService = inject(UtilsService);

    public personalForm!: FormGroup;
    public typeRequest!: { label: string; value: string; code: number } | null;
    public submitted: boolean = false;
    public isMobile: boolean = false;

    public archivoIdName: string | null = null;
    public archivoIdToUpload: File | null = null;
    public archivoIdErr: boolean = false;

    public tipos_identificacion!: Dropdown[];
    public tipos_persona_juridica!: Dropdown[];
    public tipos_calidad_solicitante!: Dropdown[];
    public departamentos!: Dropdown[];
    public municipios!: Dropdown[];
    public centros_poblados!: Dropdown[];
    public sectores!: Dropdown[];

    /**
     *
     */
    public ngOnInit () {
        this.typeRequest = this.typeRequestService.currentTypeRequest();

        this.personalForm = this.formBuilder.group({
            nombre:                   ['', Validators.required],
            tipo_identificacion:      ['', Validators.required],
            numero_documento:         ['', [Validators.required, Validators.min(1000000)]],
            fecha_expedicion:         ['', Validators.required],
            lugar_expedicion:         ['', Validators.required],
            tipo_persona_juridica:    [''],
            calidad_solicitante:      ['', Validators.required],
            celular1:                 ['', [Validators.required, Validators.min(3000000000), Validators.max(3999999999)]],
            celular2:                 ['', [Validators.min(3000000000), Validators.max(3999999999)]],
            telefono:                 ['', [Validators.min(1000000), Validators.max(6999999999)]],
            email:                    ['', [Validators.required, Validators.email]],
            direccion_departamento:   ['', Validators.required],
            direccion_municipio:      ['', Validators.required],
            sector:                   ['', Validators.required],
            direccion_centro_poblado: ['', Validators.required],
            direccion_barrio:         ['', Validators.required],
            direccion:                ['', Validators.required],
        });

        this.tipos_identificacion = this.newRequestService.tipos_identificacion;
        this.tipos_persona_juridica = this.newRequestService.tipos_persona_juridica;
        this.tipos_calidad_solicitante = this.newRequestService.tipos_calidad_solicitante;
        this.departamentos = this.newRequestService.departamentos;
        this.centros_poblados = this.newRequestService.centros_poblados;
        this.municipios = this.newRequestService.municipios;
        this.sectores = this.newRequestService.sectores;

        /* const personalInformation = JSON.parse(localStorage.getItem('personalInformation') || '{}'); */
        const personalInformation = this.newRequestService.formNewRequest().usuarios_solicitantes;
        if (personalInformation) {
            // Configura los controles según el tipo de identificación
            this.personalForm.patchValue({ tipo_identificacion: personalInformation.tipo_identificacion });
            this.onChangetipo_identificacion();

            // Aplica los valores después de configurar los controles dinámicos
            this.personalForm.setValue(personalInformation);

            if (!personalInformation.numero_documento) {
                this.personalForm.get('numero_documento')?.setValue(null);
            }
            if (!personalInformation.celular1) {
                this.personalForm.get('celular1')?.setValue(null);
            }
            if (!personalInformation.celular2) {
                this.personalForm.get('celular2')?.setValue(null);
            }
            if (!personalInformation.telefono) {
                this.personalForm.get('telefono')?.setValue(null);
            }
        }
        
        const archivoId = this.newRequestService.formNewRequest().archivo_documento;
        if (archivoId) {
            this.archivoIdToUpload = archivoId;
            this.archivoIdName = this.utilsService.truncateStringWithEllipsis(archivoId.name);
        }

        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.isMobile = result.matches;
        });
    }

    /**
     * Handles the file selection event for the identification document.
     * @param {Event} event - The file input change event.
     */
    public onarchivoIdSelected (event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.archivoIdToUpload = input.files[0];
            this.archivoIdName = this.utilsService.truncateStringWithEllipsis(this.archivoIdToUpload.name);
            this.archivoIdErr = false;
        } else {
            this.archivoIdToUpload = null;
            this.archivoIdName = null;
            this.archivoIdErr = true;
        }
    }

    /**
     *
     */
    public onChangetipo_identificacion () {
        const tipo_identificacion = this.personalForm.get('tipo_identificacion')?.value;
        if (tipo_identificacion === '2') {
            this.updateFormControls(['tipo_persona_juridica'], ['lugar_expedicion', 'fecha_expedicion']);
        } else if (tipo_identificacion === '0' || tipo_identificacion === '1') {
            this.updateFormControls(['lugar_expedicion', 'fecha_expedicion'], ['tipo_persona_juridica']);
        }
    }

    /**
     * Updates the form controls by adding and removing specified controls.
     * @param {string[]} addControls - The controls to add.
     * @param {string[]} removeControls - The controls to remove.
     */
    private updateFormControls (addControls: string[], removeControls: string[]) {
        addControls.forEach(control => {
            if (!this.personalForm.get(control)) {
                this.personalForm.addControl(control, this.formBuilder.control(null, Validators.required));
            }
        });

        removeControls.forEach(control => {
            if (this.personalForm.get(control)) {
                this.personalForm.removeControl(control);
            }
        });
    }

    /**
     * Navigates to the next page after validating the form.
     */
    public nextPage () {
        this.submitted = true;
        if (!this.archivoIdToUpload) {
            this.archivoIdErr = true;
        }
        if (this.personalForm.invalid || this.archivoIdErr) {
            console.log('Invalid form');
            console.log(this.personalForm);
            return;
        }

        const processedData = this.utilsService.convertFormValuesToStrings<UsuarioSolicitanteNewRequest>(
            this.personalForm.getRawValue()
        );
        this.newRequestService.formNewRequest.set({
            ...this.newRequestService.formNewRequest(),
            usuarios_solicitantes: processedData,
        });

        this.newRequestService.formNewRequest().archivo_documento = this.archivoIdToUpload;

        this.router.navigate(['../informacion-inmueble'], { relativeTo: this.activatedRoute });
    }
}
