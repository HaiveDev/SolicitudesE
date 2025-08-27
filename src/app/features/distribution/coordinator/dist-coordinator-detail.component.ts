import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown, DataAssignmentDist, ResultRequestDetail } from '@interfaces/index';
import { DistAssignmentService, RequestDetailService } from '@services/index';

import { RequestDetailComponent } from '@components/request-detail/request-detail.component';
import { UtilsService } from '@shared/utils/utils.service';

import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-dist-coordinator-detail',
    standalone: true,
    imports: [
        BlockUIModule,
        ButtonModule,
        CalendarModule,
        CommonModule,
        DropdownModule,
        InputTextareaModule,
        MessagesModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        RequestDetailComponent,
        TabViewModule,
        ToastModule,
    ],
    providers: [MessageService],
    template: `
        <p-toast position="top-center" life="5000" preventOpenDuplicates="true" />
        <p-blockUI [blocked]="LoadingRequestAssignment || LoadingRequestRejection">
            <div class="text-center">
                <p-progressSpinner styleClass="w-4rem" strokeWidth="3" fill="transparent" animationDuration="0.5s" />
                <h5 class="text-white mt-1">
                    @if (LoadingRequestAssignment) {
                        Asignando solicitud...
                    } @else {
                        Rechazando solicitud...
                    }
                </h5>
            </div>
        </p-blockUI>
        <div class="card">
            @defer (when responseRequestDetail() !== null) {
                <app-request-detail [responseRequestDetail]="responseRequestDetail()" [routeBack]="routeBack" />

                @if (responseRequestDetail()?.solicitudes?.estado !== "Creada") {
                    <p-messages
                        styleClass="mt-4"
                        [value]="[{ severity: 'info', detail: messageInfoStatus! }]"
                        [enableService]="false"
                        [closable]="false" />
                } @else {
                    <p-tabView styleClass="mt-4">
                        <p-tabPanel header="Formulario de asignación">
                            <form [formGroup]="assignmentForm" class="p-fluid formgrid grid">
                                <!-- Linea 1 -->
                                <div class="field col-12 sm:col-6">
                                    <label for="jornada" class="required">Fecha para la visita</label>
                                    <p-calendar
                                        [minDate]="minDate"
                                        placeholder="MM/DD/AAAA"
                                        [iconDisplay]="'input'"
                                        [showIcon]="true"
                                        appendTo="body"
                                        formControlName="fecha_agendamiento"
                                        inputId="fecha_agendamiento" />
                                    @if (
                                        assignmentForm.get('fecha_agendamiento')?.invalid &&
                                        (submAssignmentForm || assignmentForm.get('fecha_agendamiento')?.dirty)
                                    ) {
                                        <small class="p-error">Fecha de agendamiento es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 sm:col-6">
                                    <label for="jornada" class="required">Jornada de la visita</label>
                                    <p-dropdown
                                        [autoOptionFocus]="false"
                                        [options]="matchdayOptions"
                                        formControlName="jornada"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="jornada" />
                                    @if (
                                        assignmentForm.get('jornada')?.invalid &&
                                        (submAssignmentForm || assignmentForm.get('jornada')?.dirty)
                                    ) {
                                        <small class="p-error">Jornada es requerida</small>
                                    }
                                </div>
                                <!-- linea 2 -->
                                <div class="field col-12 sm:col-4">
                                    <label for="tecnico1" class="required">Técnico 1</label>
                                    <p-dropdown
                                        [resetFilterOnHide]="true"
                                        [showClear]="true"
                                        (onChange)="onTecnico1Select($event.value)"
                                        filter="true"
                                        [filterFields]="['name', 'subdata', 'code']"
                                        [autoOptionFocus]="false"
                                        [options]="techniciansList!"
                                        formControlName="tecnico1"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="tecnico1">
                                        <ng-template let-tecnico pTemplate="item">
                                            <div class="flex flex-column gap-0">
                                                <div>{{ tecnico.name }}</div>
                                                <small class="text-color-secondary">{{ tecnico.subdata }}</small>
                                            </div>
                                        </ng-template>
                                    </p-dropdown>
                                    @if (
                                        assignmentForm.get('tecnico1')?.invalid &&
                                        (submAssignmentForm || assignmentForm.get('tecnico1')?.dirty)
                                    ) {
                                        <small class="p-error">Técnico 1 es requerido</small>
                                    }
                                </div>
                                <div class="field col-12 sm:col-4">
                                    <label for="tecnico2" class="required">Técnico 2</label>
                                    <p-dropdown
                                        [resetFilterOnHide]="true"
                                        [showClear]="true"
                                        (onChange)="onTecnico2Select($event.value)"
                                        filter="true"
                                        [filterFields]="['name', 'subdata', 'code']"
                                        [autoOptionFocus]="false"
                                        [options]="techniciansList!"
                                        formControlName="tecnico2"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="tecnico2">
                                        <ng-template let-tecnico pTemplate="item">
                                            <div class="flex flex-column gap-0">
                                                <div>{{ tecnico.name }}</div>
                                                <small class="text-color-secondary">{{ tecnico.subdata }}</small>
                                            </div>
                                        </ng-template>
                                    </p-dropdown>
                                    @if (
                                        assignmentForm.get('tecnico2')?.invalid &&
                                        (submAssignmentForm || assignmentForm.get('tecnico2')?.dirty)
                                    ) {
                                        <small class="p-error">Técnico 2 es requerido</small>
                                    }
                                </div>
                                <div class="field col-12 sm:col-4">
                                    <label for="tecnico3">Técnico 3</label>
                                    <p-dropdown
                                        [resetFilterOnHide]="true"
                                        [showClear]="true"
                                        (onChange)="onTecnico3Select($event.value)"
                                        filter="true"
                                        [filterFields]="['name', 'subdata', 'code']"
                                        [autoOptionFocus]="false"
                                        [options]="techniciansList!"
                                        formControlName="tecnico3"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="tecnico3">
                                        <ng-template let-tecnico pTemplate="item">
                                            <div class="flex flex-column gap-0">
                                                <div>{{ tecnico.name }}</div>
                                                <small class="text-color-secondary">{{ tecnico.subdata }}</small>
                                            </div>
                                        </ng-template>
                                    </p-dropdown>
                                </div>
                                <!-- Linea 3 -->
                                <div class="field col-12">
                                    <label for="observacionAsignacion">Observación</label>
                                    <textarea
                                        id="observacionAsignacion"
                                        pInputTextarea
                                        formControlName="observacion"
                                        rows="5"
                                        [autoResize]="true"
                                        maxlength="250"></textarea>
                                    <div class="flex justify-content-between">
                                        <small class="text-color-secondary">Máximo 250 caracteres</small>
                                        <small
                                            [ngClass]="{
                                                'text-color-secondary':
                                                    assignmentForm.get('observacion')?.value?.length < 250,
                                                'p-error': assignmentForm.get('observacion')?.value?.length === 250,
                                            }">
                                            {{ assignmentForm.get('observacion')?.value?.length }}/250
                                        </small>
                                    </div>
                                </div>
                            </form>
                            <footer>
                                <div class="flex justify-content-end w-full mt-6">
                                    <p-button
                                        label="Asignar solicitud"
                                        (click)="asignar()"
                                        icon="pi pi-angle-right"
                                        iconPos="right"
                                        styleClass="p-button-success" />
                                </div>
                            </footer>
                        </p-tabPanel>
                        <p-tabPanel header="Formulario de rechazo">
                            <form [formGroup]="rejectionForm" class="p-fluid formgrid grid">
                                <div class="field col-12">
                                    <label for="observacionRechazo" class="required">Observación</label>
                                    <textarea
                                        id="observacionRechazo"
                                        pInputTextarea
                                        formControlName="observacion"
                                        rows="5"
                                        [autoResize]="true"
                                        class="h-auto"
                                        maxlength="250"></textarea>
                                    <div class="flex justify-content-between">
                                        <small class="text-color-secondary">Máximo 250 caracteres</small>
                                        <small
                                            [ngClass]="{
                                                'text-color-secondary':
                                                    rejectionForm.get('observacion')?.value?.length < 250,
                                                'p-error': rejectionForm.get('observacion')?.value?.length === 250,
                                            }">
                                            {{ rejectionForm.get('observacion')?.value?.length }}/250
                                        </small>
                                    </div>
                                    @if (
                                        rejectionForm.get('observacion')?.invalid &&
                                        (submRejectionForm || rejectionForm.get('observacion')?.dirty)
                                    ) {
                                        <small class="p-error">Observación es requerida</small>
                                    }
                                </div>
                            </form>
                            <footer>
                                <div class="flex justify-content-end w-full mt-6">
                                    <p-button
                                        label="Rechazar solicitud"
                                        (click)="rechazar()"
                                        icon="pi pi-times"
                                        iconPos="right"
                                        styleClass="p-button-danger" />
                                </div>
                            </footer>
                        </p-tabPanel>
                    </p-tabView>
                }
            } @placeholder {
                @if (!back()) {
                    <div class="text-center">
                        <p-progressSpinner
                            styleClass="w-4rem"
                            strokeWidth="3"
                            fill="transparent"
                            animationDuration="0.5s" />
                        <h5 class="mt-1">Cargando detalle de solicitud...</h5>
                    </div>
                }
            }
            @if (back()) {
                <p-button
                    (click)="router.navigate([routeBack])"
                    styleClass="text-gray-700"
                    icon="pi pi-arrow-left"
                    size="small"
                    label="Volver"
                    [text]="true"
                    severity="secondary" />
                <p-messages
                    [value]="[{ severity: 'info', detail: messageInfo! }]"
                    [enableService]="false"
                    [closable]="false" />
            }
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistCoordinatorDetailComponent implements OnInit, OnDestroy {
    private formBuilder = inject(FormBuilder);
    public router = inject(Router);
    private currentRoute = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private requestDetailService = inject(RequestDetailService);
    public distAssignmentService = inject(DistAssignmentService);
    private utilsService = inject(UtilsService);

    public assignmentForm!: FormGroup;
    public rejectionForm!: FormGroup;
    public submAssignmentForm: boolean = false;
    public submRejectionForm: boolean = false;
    public LoadingRequestAssignment: boolean = false;
    public LoadingRequestRejection: boolean = false;
    private requestNumber: string | null = null;
    public minDate: Date = new Date();
    public responseRequestDetail = signal<ResultRequestDetail | null>(null);
    public back = signal<boolean>(false);
    public routeBack = '/distribucion/coordinador';
    public messageInfo: string | null = null;
    public messageInfoStatus: string | null = null;

    public techniciansList!: Dropdown[] | null;
    public selectedTechnician1Id: string | null = null;
    public selectedTechnician2Id: string | null = null;
    public selectedTechnician3Id: string | null = null;

    public matchdayOptions: Dropdown[] = [
        { name: 'Mañana', code: '1' },
        { name: 'Tarde', code: '2' },
        { name: 'Sin preferencia', code: '3' },
    ];

    /**
     *
     */
    public ngOnInit (): void {
        this.currentRoute.params.subscribe(params => {
            this.requestNumber = params['request-number'];
        });

        this.requestDetailService.getRequestDetails(this.requestNumber!).subscribe({
            next: results => {
                if (!results) {
                    this.back.set(true);
                    this.messageInfo = 'No se ha encontrado la solicitud solicitada';
                    return;
                }
                this.responseRequestDetail.set(results);

                this.messageInfoStatus =
                    this.responseRequestDetail()?.solicitudes?.estado === "Anulada"
                        ? 'La solicitud ha sido rechazada'
                        : this.responseRequestDetail()?.solicitudes?.estado !== "Creada"
                          ? 'La solicitud ya ha sido asignada'
                          : '';
            },
            error: () => {
                this.back.set(true);
                this.messageInfo = 'Código de solicitud no válido';
            },
        });

        this.loadTechnicalList();

        this.assignmentForm = this.formBuilder.group({
            solicitud: this.requestNumber,
            fecha_agendamiento: ['', Validators.required],
            jornada: [null, Validators.required],
            tecnico1: [null, Validators.required],
            tecnico2: [null, Validators.required],
            tecnico3: [null],
            observacion: [''],
        });

        this.rejectionForm = this.formBuilder.group({
            observacion: ['', Validators.required],
        });
    }

    /**
     *
     */
    public loadTechnicalList (): void {
        if (this.distAssignmentService.techniciansList() === null) {
            this.distAssignmentService.getTechnicalList().subscribe({
                next: () => {
                    this.techniciansList = this.distAssignmentService.techniciansList();
                },
                error: error => {
                    console.log(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se ha podido obtener la lista de técnicos',
                    });
                },
            });
        } else {
            this.techniciansList = this.distAssignmentService.techniciansList();
        }
    }

    /**
     * Handles the selection of a technician.
     * @param {string} tecnicoId - ID of the selected technician.
     * @param {keyof this} currentField - The current field (selectedTechnician1Id, selectedTechnician2Id, selectedTechnician3Id).
     * @param {string} formControlName - Name of the form control ('tecnico1', 'tecnico2', 'tecnico3').
     * @param {Record<string, keyof this>} otherFields - Other selected fields { '1': selectedTechnician1Id, '2': selectedTechnician2Id, ... }.
     */
    private handleTecnicoSelect (
        tecnicoId: string | null,
        currentField: keyof this,
        formControlName: string,
        otherFields: Record<string, keyof this>
    ): void {
        if (tecnicoId !== null) {
            const conflict = Object.entries(otherFields).find(([, field]) => this[field] === tecnicoId);
            if (conflict) {
                const [conflictFieldNumber] = conflict;
                const maskedId = `${tecnicoId.slice(0, 3)}**${tecnicoId.slice(-3)}`;

                this.messageService.add({
                    severity: 'info',
                    summary: 'Ups!',
                    detail: `El técnico ${maskedId} ya está designado como técnico ${conflictFieldNumber}`,
                });

                const previousValue = this[currentField] as string | null;
                this.assignmentForm.get(formControlName)?.setValue(previousValue ?? null);
                return;
            }
            this[currentField] = tecnicoId as this[keyof this];
        } else {
            this[currentField] = null as this[keyof this];
        }
    }

    /**
     * Triggered when técnico1 is selected
     * @param {string} tecnicoId
     */
    public onTecnico1Select (tecnicoId: string): void {
        this.handleTecnicoSelect(tecnicoId, 'selectedTechnician1Id', 'tecnico1', {
            '2': 'selectedTechnician2Id',
            '3': 'selectedTechnician3Id',
        });
    }

    /**
     * Triggered when técnico2 is selected
     * @param {string} tecnicoId
     */
    public onTecnico2Select (tecnicoId: string): void {
        this.handleTecnicoSelect(tecnicoId, 'selectedTechnician2Id', 'tecnico2', {
            '1': 'selectedTechnician1Id',
            '3': 'selectedTechnician3Id',
        });
    }

    /**
     * Triggered when técnico3 is selected
     * @param {string} tecnicoId
     */
    public onTecnico3Select (tecnicoId: string): void {
        this.handleTecnicoSelect(tecnicoId, 'selectedTechnician3Id', 'tecnico3', {
            '1': 'selectedTechnician1Id',
            '2': 'selectedTechnician2Id',
        });
    }

    /**
     *
     */
    public asignar () {
        this.submAssignmentForm = true;
        if (this.assignmentForm.valid) {
            this.LoadingRequestAssignment = true;
            const processedData = this.utilsService.convertFormValuesToStrings<DataAssignmentDist>(
                this.assignmentForm.getRawValue()
            );
            console.log(processedData);
            this.distAssignmentService.formAssignmentDist().asignaciones = processedData
            this.distAssignmentService.createAssignment().subscribe({
                next: () => {
                    this.LoadingRequestAssignment = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Solicitud asignada',
                        detail: 'Se ha asignado la solicitud correctamente',
                    });
                    this.router.navigate([this.routeBack]);
                },
                error: error => {
                    this.LoadingRequestAssignment = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    });
                },
            });

            setTimeout(() => {
                this.LoadingRequestAssignment = false;
            }, 2000);
        }
    }

    /**
     *
     */
    public rechazar () {
        this.submRejectionForm = true;
        if (this.rejectionForm.valid) {
            this.LoadingRequestRejection = true;
            console.log(this.rejectionForm.value);
            setTimeout(() => {
                this.LoadingRequestRejection = false;
            }, 2000);
        }
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Cancels any ongoing requests.
     */
    public ngOnDestroy (): void {
        this.requestDetailService.cancelRequests();
        this.distAssignmentService.cancelRequests();
    }
}
