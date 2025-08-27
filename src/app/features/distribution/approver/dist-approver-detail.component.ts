import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown, ResultRequestDetail, DataApprovalDist } from '@interfaces/index';
import { DistApprovalService, RequestDetailService } from '@services/index';

import { RequestDetailComponent } from '@components/request-detail/request-detail.component';
import { UtilsService } from '@shared/utils/utils.service';

import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-dist-approver-detail',
    standalone: true,
    imports: [
        BlockUIModule,
        ButtonModule,
        CommonModule,
        DropdownModule,
        InputNumberModule,
        InputTextareaModule,
        InputTextModule,
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
        <p-blockUI [blocked]="LoadingRequestApproval">
            <div class="text-center">
                <p-progressSpinner styleClass="w-4rem" strokeWidth="3" fill="transparent" animationDuration="0.5s" />
                <h5 class="text-white mt-1">Enviando datos...</h5>
            </div>
        </p-blockUI>
        <div class="card">
            @defer (when responseRequestDetail() !== null) {
                <app-request-detail [responseRequestDetail]="responseRequestDetail()" [routeBack]="routeBack" />

                @if (responseRequestDetail()?.solicitudes?.estado !== "Visitada") {
                    <p-messages
                        styleClass="mt-4"
                        [value]="[{ severity: 'info', detail: messageInfoStatus! }]"
                        [enableService]="false"
                        [closable]="false" />
                } @else {
                    <p-tabView styleClass="mt-4">
                        <p-tabPanel header="Formulario de aprobación">
                            <form [formGroup]="approvalForm" class="p-fluid formgrid grid">
                                <!-- linea 2 -->
                                <div class="field col-12 sm:col-4">
                                    <label for="cargabilidad" class="required">Cargabilidad</label>
                                    <p-inputNumber
                                        formControlName="cargabilidad"
                                        inputId="cargabilidad"
                                        [min]="0"
                                        [minFractionDigits]="1"
                                        [maxFractionDigits]="1"
                                        step="0.1"
                                        showClear />
                                    @if (
                                        approvalForm.get('cargabilidad')?.invalid &&
                                        (submit || approvalForm.get('cargabilidad')?.dirty)
                                    ) {
                                        <small class="p-error">Cargabilidad es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 sm:col-4">
                                    <label for="decision" class="required">Decision</label>
                                    <p-dropdown
                                        [autoOptionFocus]="false"
                                        [options]="decisions"
                                        formControlName="decision"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="decision" />
                                    @if (
                                        approvalForm.get('decision')?.invalid &&
                                        (submit || approvalForm.get('decision')?.dirty)
                                    ) {
                                        <small class="p-error">Decision es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 sm:col-4">
                                    <label for="plantilla_reporte" class="required">Tipo de plantilla</label>
                                    <p-dropdown
                                        [autoOptionFocus]="false"
                                        [options]="typesTemplates"
                                        formControlName="plantilla_reporte"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="plantilla_reporte" />
                                    @if (
                                        approvalForm.get('plantilla_reporte')?.invalid &&
                                        (submit || approvalForm.get('plantilla_reporte')?.dirty)
                                    ) {
                                        <small class="p-error">Tipo de plantilla es requerida</small>
                                    }
                                </div>
                                <div class="field col-12">
                                    <label for="procedimiento" class="required">Procedimiento</label>
                                    <input type="text" pInputText id="procedimiento" formControlName="procedimiento" />
                                    @if (
                                        approvalForm.get('procedimiento')?.invalid &&
                                        (submit || approvalForm.get('procedimiento')?.dirty)
                                    ) {
                                        <small class="p-error">Procedimiento es requerido</small>
                                    }
                                </div>
                                <!-- Linea 3 -->
                                <div class="field col-12 sm:col-6">
                                    <label for="nota" class="required">Nota</label>
                                    <textarea
                                        id="nota"
                                        pInputTextarea
                                        formControlName="nota"
                                        rows="5"
                                        [autoResize]="true"
                                        maxlength="250"></textarea>
                                    <div class="flex justify-content-between">
                                        <small class="text-color-secondary">Máximo 250 caracteres</small>
                                        <small
                                            [ngClass]="{
                                                'text-color-secondary': approvalForm.get('nota')?.value?.length < 250,
                                                'p-error': approvalForm.get('nota')?.value?.length === 250,
                                            }">
                                            {{ approvalForm.get('nota')?.value?.length }}/250
                                        </small>
                                    </div>
                                    @if (
                                        approvalForm.get('nota')?.invalid && (submit || approvalForm.get('nota')?.dirty)
                                    ) {
                                        <small class="p-error">Nota es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 sm:col-6">
                                    <label for="observacion" class="required">Observación</label>
                                    <textarea
                                        id="observacion"
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
                                                    approvalForm.get('observacion')?.value?.length < 250,
                                                'p-error': approvalForm.get('observacion')?.value?.length === 250,
                                            }">
                                            {{ approvalForm.get('observacion')?.value?.length }}/250
                                        </small>
                                    </div>
                                    @if (
                                        approvalForm.get('observacion')?.invalid &&
                                        (submit || approvalForm.get('observacion')?.dirty)
                                    ) {
                                        <small class="p-error">Observación es requerida</small>
                                    }
                                </div>
                            </form>
                            <footer>
                                <div class="flex justify-content-end w-full mt-6">
                                    <p-button
                                        label="Aprobar solicitud"
                                        (click)="aprobar()"
                                        icon="pi pi-angle-right"
                                        iconPos="right"
                                        styleClass="p-button-success" />
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
export class DistApproverDetailComponent implements OnInit, OnDestroy {
    private formBuilder = inject(FormBuilder);
    public router = inject(Router);
    private currentRoute = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private requestDetailService = inject(RequestDetailService);
    public distApprovalService = inject(DistApprovalService);
    private utilsService = inject(UtilsService);

    public approvalForm!: FormGroup;
    public submit: boolean = false;
    public LoadingRequestApproval: boolean = false;
    private requestNumber: string | null = null;
    public minDate: Date = new Date();
    public responseRequestDetail = signal<ResultRequestDetail | null>(null);
    public back = signal<boolean>(false);
    public routeBack = '/distribucion/aprobador';
    public messageInfo: string | null = null;
    public messageInfoStatus: string | null = null;

    public decisions: Dropdown[] = [
        { name: 'SI es factible en el punto de conexión.', code: '1' },
        { name: 'SI es factible en el punto de conexión con condición.', code: '2' },
        { name: 'NO es factible en el punto de conexión.', code: '3' },
    ];
    public typesTemplates: Dropdown[] = [
        { name: 'Formato básico', code: '1' },
        { name: 'Diseño simplificado', code: '2' },
        { name: 'Diseño detallado', code: '3' },
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
                        : this.responseRequestDetail()?.solicitudes?.estado !== "Visitada"
                          ? 'La solicitud no esta disponible para aprobar'
                          : '';
            },
            error: () => {
                this.back.set(true);
                this.messageInfo = 'Código de solicitud no válido';
            },
        });

        this.approvalForm = this.formBuilder.group({
            solicitud: this.requestNumber,
            cargabilidad: [null, Validators.required],
            decision: [null, Validators.required],
            plantilla_reporte: [null, Validators.required],
            procedimiento: ['', Validators.required],
            nota: ['', Validators.required],
            observacion: ['', Validators.required],
        });
    }

    /**
     *
     */
    public aprobar () {
        this.submit = true;
        if (this.approvalForm.valid) {
            this.LoadingRequestApproval = true;
            const processedData = this.utilsService.convertFormValuesToStrings<DataApprovalDist>(
                this.approvalForm.getRawValue()
            );
            console.log(processedData);
            this.distApprovalService.formApprovalDist().aprobaciones = processedData;
            this.distApprovalService.sendDataApprovalDist().subscribe({
                next: () => {
                    this.LoadingRequestApproval = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Solicitud aprobada',
                        detail: 'Se ha aprobado la solicitud correctamente',
                    });
                    this.router.navigate([this.routeBack]);
                },
                error: error => {
                    this.LoadingRequestApproval = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    });
                },
            });

            setTimeout(() => {
                this.LoadingRequestApproval = false;
            }, 2000);
        }
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Cancels any ongoing requests.
     */
    public ngOnDestroy (): void {
        this.requestDetailService.cancelRequests();
        this.distApprovalService.cancelRequests();
    }
}
