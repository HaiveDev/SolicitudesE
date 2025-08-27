import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown, DataVisitDist, ResultRequestDetail } from '@interfaces/index';
import { DistVisitService, RequestDetailService } from '@services/index';

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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
    selector: 'app-com-technician-detail',
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
        InputNumberModule,
        InputTextModule,
        InputGroupModule,
    ],
    template: `
        <p-toast position="top-center" life="5000" />
        <p-blockUI [blocked]="LoadingRequestVisit || LoadingRequestRejection">
            <div class="text-center">
                <p-progressSpinner styleClass="w-4rem" strokeWidth="3" fill="transparent" animationDuration="0.5s" />
                <h5 class="text-white mt-1">
                    @if (LoadingRequestVisit) {
                        Subiendo datos...
                    } @else {
                        Rechazando solicitud...
                    }
                </h5>
            </div>
        </p-blockUI>
        <div class="card">
            @defer (when true) {
                <!-- <app-request-detail [responseRequestDetail]="responseRequestDetail()" [routeBack]="routeBack" /> -->

                @if (false) {
                    <!-- @if (responseRequestDetail()?.solicitudes?.estado_solicitud_id?.id !== 2) { -->
                    <p-messages
                        styleClass="mt-4"
                        [value]="[{ severity: 'info', detail: messageInfoStatus! }]"
                        [enableService]="false"
                        [closable]="false" />
                } @else {
                    <p-tabView styleClass="mt-4">
                        <p-tabPanel header="Formulario de visita">
                            <form [formGroup]="visitForm" class="p-fluid formgrid grid">
                                <!-- Linea 1 -->
                                <div class="field col-12 sm:col-6">
                                    <label for="fecha_visita_inicio" class="required">
                                        Fecha de inicio de la visita
                                    </label>
                                    <p-calendar
                                        [showTime]="true"
                                        hourFormat="12"
                                        placeholder="MM/DD/AAAA HH:MM AM/PM"
                                        [iconDisplay]="'input'"
                                        [showIcon]="true"
                                        appendTo="body"
                                        formControlName="fecha_visita_inicio"
                                        inputId="fecha_visita_inicio" />
                                    @if (
                                        visitForm.get('fecha_visita_inicio')?.invalid &&
                                        (submVisitForm || visitForm.get('fecha_visita_inicio')?.dirty)
                                    ) {
                                        <small class="p-error">Fecha de inicio es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 sm:col-6">
                                    <label for="fecha_visita_fin" class="required">Fecha de fin de la visita</label>
                                    <p-calendar
                                        [showTime]="true"
                                        hourFormat="12"
                                        placeholder="MM/DD/AAAA HH:MM AM/PM"
                                        [iconDisplay]="'input'"
                                        [showIcon]="true"
                                        appendTo="body"
                                        formControlName="fecha_visita_fin"
                                        inputId="fecha_visita_fin" />
                                    @if (
                                        visitForm.get('fecha_visita_fin')?.invalid &&
                                        (submVisitForm || visitForm.get('fecha_visita_fin')?.dirty)
                                    ) {
                                        <small class="p-error">Fecha de fin es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 xl:col-4">
                                    <label for="tipo_conexion" class="required">Tipo de conexión</label>
                                    <p-dropdown
                                        [showClear]="true"
                                        [autoOptionFocus]="false"
                                        [options]="connectionsTypes"
                                        formControlName="tipo_conexion"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="tipo_conexion" />
                                    @if (
                                        visitForm.get('tipo_conexion')?.invalid &&
                                        (submVisitForm || visitForm.get('tipo_conexion')?.dirty)
                                    ) {
                                        <small class="p-error">Tipo de conexión es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 xl:col-4">
                                    <label for="tension_conectada" class="required">Tensión conectada</label>
                                    <p-dropdown
                                        [showClear]="true"
                                        [autoOptionFocus]="false"
                                        [options]="connectedVoltage"
                                        formControlName="tension_conectada"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="tension_conectada" />
                                    @if (
                                        visitForm.get('tension_conectada')?.invalid &&
                                        (submVisitForm || visitForm.get('tension_conectada')?.dirty)
                                    ) {
                                        <small class="p-error">Tensión conectada es requerida</small>
                                    }
                                </div>
                                <div class="field col-12 xl:col-4">
                                    <label for="clase_carga" class="required">Clase de carga</label>
                                    <p-dropdown
                                        [showClear]="true"
                                        [autoOptionFocus]="false"
                                        [options]="loadClass"
                                        formControlName="clase_carga"
                                        optionValue="code"
                                        optionLabel="name"
                                        placeholder="Seleccione una opción"
                                        inputId="clase_carga" />
                                    @if (
                                        visitForm.get('clase_carga')?.invalid &&
                                        (submVisitForm || visitForm.get('clase_carga')?.dirty)
                                    ) {
                                        <small class="p-error">Clase de carga es requerida</small>
                                    }
                                </div>

                                <!-- linea 2 -->
                                <div
                                    class="field col-12 sm:col-6 {{
                                        responseRequestDetail()?.solicitudes?.tipo_display !== 'Disponibilidad'
                                            ? 'xl:col-4'
                                            : ''
                                    }}">
                                    <label for="latitud_punto_instalacion" class="required">Punto de instalación</label>
                                    <div class="flex gap-2">
                                        <div class="w-full">
                                            <p-inputNumber
                                                [maxFractionDigits]="6"
                                                [minFractionDigits]="6"
                                                formControlName="latitud_punto_instalacion"
                                                inputId="latitud_punto_instalacion"
                                                placeholder="Latitud"
                                                step="0.1" />
                                            @if (
                                                visitForm.get('latitud_punto_instalacion')?.errors?.['required'] &&
                                                (submVisitForm || visitForm.get('latitud_punto_instalacion')?.dirty)
                                            ) {
                                                <small class="p-error">
                                                    Latitud del punto de instalación es requerida
                                                </small>
                                            } @else if (visitForm.get('latitud_punto_instalacion')?.errors?.['min']) {
                                                <small class="p-error">Latitud debe ser mayor a 1.860000</small>
                                            } @else if (visitForm.get('latitud_punto_instalacion')?.errors?.['max']) {
                                                <small class="p-error">Latitud debe ser menor a 2.930000</small>
                                            }
                                        </div>
                                        <div class="w-full">
                                            <p-inputNumber
                                                [maxFractionDigits]="6"
                                                [minFractionDigits]="6"
                                                formControlName="longitud_punto_instalacion"
                                                inputId="longitud_punto_instalacion"
                                                placeholder="Longitud"
                                                step="0.1" />
                                            @if (
                                                visitForm.get('longitud_punto_instalacion')?.errors?.['required'] &&
                                                (submVisitForm || visitForm.get('longitud_punto_instalacion')?.dirty)
                                            ) {
                                                <small class="p-error">
                                                    Longitud del punto de instalación es requerida
                                                </small>
                                            } @else if (visitForm.get('longitud_punto_instalacion')?.errors?.['min']) {
                                                <small class="p-error">Longitud debe ser mayor a -72.000000</small>
                                            } @else if (visitForm.get('longitud_punto_instalacion')?.errors?.['max']) {
                                                <small class="p-error">Longitud debe ser menor a -73.000000</small>
                                            }
                                        </div>
                                    </div>
                                </div>
                                @if (responseRequestDetail()?.solicitudes?.tipo_display !== 'Disponibilidad') {
                                    <div class="field col-12 sm:col-6 xl:col-4">
                                        <label for="latitud_punto_conexion" class="required">Punto de conexión</label>
                                        <div class="flex gap-2">
                                            <div class="w-full">
                                                <p-inputNumber
                                                    [maxFractionDigits]="6"
                                                    [minFractionDigits]="6"
                                                    formControlName="latitud_punto_conexion"
                                                    inputId="latitud_punto_conexion"
                                                    placeholder="Latitud"
                                                    step="0.1" />
                                                @if (
                                                    visitForm.get('latitud_punto_conexion')?.errors?.['required'] &&
                                                    (submVisitForm || visitForm.get('latitud_punto_conexion')?.dirty)
                                                ) {
                                                    <small class="p-error">
                                                        Latitud del punto de conexión es requerida
                                                    </small>
                                                } @else if (visitForm.get('latitud_punto_conexion')?.errors?.['min']) {
                                                    <small class="p-error">Latitud debe ser mayor a 1.860000</small>
                                                } @else if (visitForm.get('latitud_punto_conexion')?.errors?.['max']) {
                                                    <small class="p-error">Latitud debe ser menor a 2.930000</small>
                                                }
                                            </div>
                                            <div class="w-full">
                                                <p-inputNumber
                                                    [maxFractionDigits]="6"
                                                    [minFractionDigits]="6"
                                                    formControlName="longitud_punto_conexion"
                                                    inputId="longitud_punto_conexion"
                                                    placeholder="Longitud"
                                                    step="0.1" />
                                                @if (
                                                    visitForm.get('longitud_punto_conexion')?.errors?.['required'] &&
                                                    (submVisitForm || visitForm.get('longitud_punto_conexion')?.dirty)
                                                ) {
                                                    <small class="p-error">
                                                        Longitud del punto de conexión es requerida
                                                    </small>
                                                } @else if (visitForm.get('longitud_punto_conexion')?.errors?.['min']) {
                                                    <small class="p-error">Longitud debe ser mayor a -72.000000</small>
                                                } @else if (visitForm.get('longitud_punto_conexion')?.errors?.['max']) {
                                                    <small class="p-error">Longitud debe ser menor a -73.000000</small>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field col-12 sm:col-6 xl:col-4">
                                        <label for="latitud_transformador" class="required">
                                            Punto de transformador
                                        </label>
                                        <div class="flex gap-2">
                                            <div class="w-full">
                                                <p-inputNumber
                                                    [maxFractionDigits]="6"
                                                    [minFractionDigits]="6"
                                                    formControlName="latitud_transformador"
                                                    inputId="latitud_transformador"
                                                    placeholder="Latitud"
                                                    step="0.1" />
                                                @if (
                                                    visitForm.get('latitud_transformador')?.errors?.['required'] &&
                                                    (submVisitForm || visitForm.get('latitud_transformador')?.dirty)
                                                ) {
                                                    <small class="p-error">
                                                        Latitud del punto del transformador es requerida
                                                    </small>
                                                } @else if (visitForm.get('latitud_transformador')?.errors?.['min']) {
                                                    <small class="p-error">Latitud debe ser mayor a 1.860000</small>
                                                } @else if (visitForm.get('latitud_transformador')?.errors?.['max']) {
                                                    <small class="p-error">Latitud debe ser menor a 2.930000</small>
                                                }
                                            </div>
                                            <div class="w-full">
                                                <p-inputNumber
                                                    [maxFractionDigits]="6"
                                                    [minFractionDigits]="6"
                                                    formControlName="longitud_transformador"
                                                    inputId="longitud_transformador"
                                                    placeholder="Longitud"
                                                    step="0.1" />
                                                @if (
                                                    visitForm.get('longitud_transformador')?.errors?.['required'] &&
                                                    (submVisitForm || visitForm.get('longitud_transformador')?.dirty)
                                                ) {
                                                    <small class="p-error">
                                                        Longitud del punto del transformador es requerida
                                                    </small>
                                                } @else if (visitForm.get('longitud_transformador')?.errors?.['min']) {
                                                    <small class="p-error">Longitud debe ser mayor a -72.000000</small>
                                                } @else if (visitForm.get('longitud_transformador')?.errors?.['max']) {
                                                    <small class="p-error">Longitud debe ser menor a -73.000000</small>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <!-- linea 5 -->
                                    <div class="field col-12 sm:col-6 xl:col-4 xxl:col-3">
                                        <label for="corriente_fecha_lectura" class="required">
                                            Fecha de lectura de la corriente
                                        </label>
                                        <p-calendar
                                            [showTime]="true"
                                            hourFormat="12"
                                            placeholder="MM/DD/AAAA HH:MM AM/PM"
                                            [iconDisplay]="'input'"
                                            [showIcon]="true"
                                            appendTo="body"
                                            formControlName="corriente_fecha_lectura"
                                            inputId="corriente_fecha_lectura" />
                                        @if (
                                            visitForm.get('corriente_fecha_lectura')?.invalid &&
                                            (submVisitForm || visitForm.get('corriente_fecha_lectura')?.dirty)
                                        ) {
                                            <small class="p-error">Fecha de lectura de la corriente es requerida</small>
                                        }
                                    </div>
                                    <div class="hidden xl:block xxl:hidden sm:col-6 xl:col-8"></div>

                                    <!-- linea 5 -->
                                    <div class="field col-4 xxl:col-3">
                                        <label for="corriente_x" class="required">Corriente x</label>
                                        <p-inputNumber
                                            placeholder="x"
                                            formControlName="corriente_x"
                                            inputId="corriente_x"
                                            [min]="0"
                                            [minFractionDigits]="1"
                                            [maxFractionDigits]="1"
                                            step="0.1"
                                            showClear />
                                        @if (
                                            visitForm.get('corriente_x')?.invalid &&
                                            (submVisitForm || visitForm.get('corriente_x')?.dirty)
                                        ) {
                                            <small class="p-error">Corriente x es requerida</small>
                                        }
                                    </div>
                                    <div class="field col-4 xxl:col-3">
                                        <label for="corriente_y" class="required">Corriente y</label>
                                        <p-inputNumber
                                            placeholder="y"
                                            formControlName="corriente_y"
                                            inputId="corriente_y"
                                            [min]="0"
                                            [minFractionDigits]="1"
                                            [maxFractionDigits]="1"
                                            step="0.1"
                                            showClear />
                                        @if (
                                            visitForm.get('corriente_y')?.invalid &&
                                            (submVisitForm || visitForm.get('corriente_y')?.dirty)
                                        ) {
                                            <small class="p-error">Corriente y es requerida</small>
                                        }
                                    </div>
                                    <div class="field col-4 xxl:col-3">
                                        <label for="corriente_z" class="required">Corriente z</label>
                                        <p-inputNumber
                                            placeholder="z"
                                            formControlName="corriente_z"
                                            inputId="corriente_z"
                                            [min]="0"
                                            [minFractionDigits]="1"
                                            [maxFractionDigits]="1"
                                            step="0.1"
                                            showClear />
                                        @if (
                                            visitForm.get('corriente_z')?.invalid &&
                                            (submVisitForm || visitForm.get('corriente_z')?.dirty)
                                        ) {
                                            <small class="p-error">Corriente z es requerida</small>
                                        }
                                    </div>

                                    <!-- linea 6 -->
                                    <div class="field col-12 sm:col-4">
                                        <label for="circuito" class="required">Circuito</label>
                                        <p-dropdown
                                            [resetFilterOnHide]="true"
                                            [showClear]="true"
                                            filter="true"
                                            [filterFields]="['name']"
                                            [autoOptionFocus]="false"
                                            [options]="circuits"
                                            formControlName="circuito"
                                            optionValue="code"
                                            optionLabel="name"
                                            placeholder="Seleccione una opción"
                                            inputId="circuito" />
                                        @if (
                                            visitForm.get('circuito')?.invalid &&
                                            (submVisitForm || visitForm.get('circuito')?.dirty)
                                        ) {
                                            <small class="p-error">Circuito es requerido</small>
                                        }
                                    </div>
                                    <div class="field col-12 sm:col-4">
                                        <label for="nodo_poste" class="required">Nodo del poste</label>
                                        <input id="nodo_poste" type="text" pInputText formControlName="nodo_poste" />
                                        @if (
                                            visitForm.get('nodo_poste')?.invalid &&
                                            (submVisitForm || visitForm.get('nodo_poste')?.dirty)
                                        ) {
                                            <small class="p-error">Nodo del poste es requerido</small>
                                        }
                                    </div>
                                    <div class="field col-12 sm:col-4">
                                        <label for="placa_transformador" class="required">
                                            Placa del transformador
                                        </label>
                                        <input
                                            id="placa_transformador"
                                            type="text"
                                            pInputText
                                            formControlName="placa_transformador" />
                                        @if (
                                            visitForm.get('placa_transformador')?.invalid &&
                                            (submVisitForm || visitForm.get('placa_transformador')?.dirty)
                                        ) {
                                            <small class="p-error">Placa del transformador es requerida</small>
                                        }
                                    </div>

                                    <!-- linea 7 -->
                                    <div class="field col-12 sm:col-6 md:col-3">
                                        <label for="tipo_transformador" class="required">Tipo de transformador</label>
                                        <p-dropdown
                                            [showClear]="true"
                                            [autoOptionFocus]="false"
                                            [options]="transformersTypes"
                                            formControlName="tipo_transformador"
                                            optionValue="code"
                                            optionLabel="name"
                                            placeholder="Seleccione una opción"
                                            inputId="tipo_transformador" />
                                        @if (
                                            visitForm.get('tipo_transformador')?.invalid &&
                                            (submVisitForm || visitForm.get('tipo_transformador')?.dirty)
                                        ) {
                                            <small class="p-error">Tipo de transformador es requerido</small>
                                        }
                                    </div>
                                    <div class="field col-12 sm:col-6 md:col-3">
                                        <label for="potencia_transformador" class="required">
                                            Potencia del transformador
                                        </label>
                                        <p-inputNumber
                                            formControlName="potencia_transformador"
                                            inputId="potencia_transformador"
                                            suffix=" kVA"
                                            [min]="0"
                                            [minFractionDigits]="1"
                                            [maxFractionDigits]="1"
                                            step="0.1"
                                            showClear />
                                        @if (
                                            visitForm.get('potencia_transformador')?.invalid &&
                                            (submVisitForm || visitForm.get('potencia_transformador')?.dirty)
                                        ) {
                                            <small class="p-error">Potencia del transformador es requerida</small>
                                        }
                                    </div>
                                    <div class="field col-12 sm:col-6 md:col-3">
                                        <label for="red_existente" class="required">Red existente</label>
                                        <p-dropdown
                                            [showClear]="true"
                                            [autoOptionFocus]="false"
                                            [options]="redExisting"
                                            formControlName="red_existente"
                                            optionValue="code"
                                            optionLabel="name"
                                            placeholder="Seleccione una opción"
                                            inputId="red_existente" />
                                        @if (
                                            visitForm.get('red_existente')?.invalid &&
                                            (submVisitForm || visitForm.get('red_existente')?.dirty)
                                        ) {
                                            <small class="p-error">Red existente es requerida</small>
                                        }
                                    </div>
                                    <div class="field col-12 sm:col-6 md:col-3">
                                        <label for="tipo_red_existente" class="required">
                                            Tipo de de red existente
                                        </label>
                                        <p-dropdown
                                            [showClear]="true"
                                            [autoOptionFocus]="false"
                                            [options]="redExistingTypes"
                                            formControlName="tipo_red_existente"
                                            optionValue="code"
                                            optionLabel="name"
                                            placeholder="Seleccione una opción"
                                            inputId="tipo_red_existente" />
                                        @if (
                                            visitForm.get('tipo_red_existente')?.invalid &&
                                            (submVisitForm || visitForm.get('tipo_red_existente')?.dirty)
                                        ) {
                                            <small class="p-error">Tipo de de red existente es requerida</small>
                                        }
                                    </div>

                                    <!-- linea 8 -->
                                    <div class="field col-12  md:col-6 xl:col-4">
                                        <label for="photoNode" class="required">Foto del nodo</label>
                                        <div class="custom-file-button">
                                            <label class="text-left" for="photoNode">
                                                <i class="pi pi-upload mr-3"></i>
                                                @if (photoNodeName) {
                                                    <span>{{ photoNodeName }}</span>
                                                } @else {
                                                    <span>Seleccione una foto</span>
                                                }
                                            </label>
                                            <input
                                                type="file"
                                                id="photoNode"
                                                name="file"
                                                accept="image/*" />
                                        </div>
                                        @if (photoNodeErr) {
                                            <small class="p-error">Foto del nodo es requerida</small>
                                        }
                                        @if (previewPhotoNode()) {
                                            <div class="w-full flex justify-content-center">
                                                <img
                                                    [src]="previewPhotoNode()"
                                                    alt="Preview de la foto del nodo"
                                                    class="mt-1" />
                                            </div>
                                        }
                                    </div>
                                    <div class="field col-12  md:col-6 xl:col-4">
                                        <label for="photoTransformer" class="required">Foto del transformador</label>
                                        <div class="custom-file-button">
                                            <label class="text-left" for="photoTransformer">
                                                <i class="pi pi-upload mr-3"></i>
                                                @if (photoTransformerName) {
                                                    <span>{{ photoTransformerName }}</span>
                                                } @else {
                                                    <span>Seleccione una foto</span>
                                                }
                                            </label>
                                            <input
                                                type="file"
                                                id="photoTransformer"
                                                
                                                name="file"
                                                accept="image/*" />
                                        </div>
                                        @if (photoTransformerErr) {
                                            <small class="p-error">Foto del transformador es requerida</small>
                                        }
                                        @if (previewPhotoTransformer()) {
                                            <div class="w-full flex justify-content-center">
                                                <img
                                                    [src]="previewPhotoTransformer()"
                                                    alt="Preview de la foto del transformador"
                                                    class="mt-1" />
                                            </div>
                                        }
                                    </div>
                                }
                                <div
                                    class="field col-12 {{
                                        responseRequestDetail()?.solicitudes?.tipo_display !== 'Disponibilidad'
                                            ? 'xl:col-4'
                                            : 'sm:col-6'
                                    }}">
                                    <label for="fotoFachada" class="required">Foto de la fachada</label>
                                    <div class="custom-file-button">
                                        <label class="text-left" for="fotoFachada">
                                            <i class="pi pi-upload mr-3"></i>
                                            @if (fotoFachadaName) {
                                                <span>{{ fotoFachadaName }}</span>
                                            } @else {
                                                <span>Seleccione una foto</span>
                                            }
                                        </label>
                                        <input
                                            type="file"
                                            id="fotoFachada"
                                            name="file"
                                            accept="image/*" />
                                    </div>
                                    @if (fotoFachadaErr) {
                                        <small class="p-error">Foto de la fachada es requerida</small>
                                    }
                                    @if (previewFotoFachada()) {
                                        <div class="w-full flex justify-content-center">
                                            <img
                                                [src]="previewFotoFachada()"
                                                alt="Preview de la foto de la fachada"
                                                class="mt-1" />
                                        </div>
                                    }
                                </div>

                                <!-- Linea 9 -->
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
                                                    visitForm.get('observacion')?.value?.length < 250,
                                                'p-error': visitForm.get('observacion')?.value?.length === 250,
                                            }">
                                            {{ visitForm.get('observacion')?.value?.length }}/250
                                        </small>
                                    </div>
                                </div>
                            </form>
                            <footer>
                                <div class="flex justify-content-end w-full mt-6">
                                    <p-button
                                        label="Enviar datos"
                                        
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComTechnicianDetailComponent implements OnInit {

    private formBuilder = inject(FormBuilder);
    public router = inject(Router);
    private currentRoute = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private requestDetailService = inject(RequestDetailService);
    public distVisitService = inject(DistVisitService);
    private utilsService = inject(UtilsService);

    public visitForm!: FormGroup;
    public rejectionForm!: FormGroup;
    public submVisitForm: boolean = false;
    public submRejectionForm: boolean = false;
    public LoadingRequestVisit: boolean = false;
    public LoadingRequestRejection: boolean = false;
    private requestNumber: string | null = null;
    public responseRequestDetail = signal<ResultRequestDetail | null>(null);
    public back = signal<boolean>(false);
    public routeBack = '/distribucion/tecnico';
    public messageInfo: string | null = null;
    public messageInfoStatus: string | null = null;

    public photoNodeErr: boolean = false;
    public photoNodeName: string | null = null;
    public photoNodeToUpload: File | null = null;
    public previewPhotoNode = signal<string | null>(null);

    public photoTransformerErr: boolean = false;
    public photoTransformerName: string | null = null;
    public photoTransformerToUpload: File | null = null;
    public previewPhotoTransformer = signal<string | null>(null);

    public fotoFachadaErr: boolean = false;
    public fotoFachadaName: string | null = null;
    public fotoFachadaToUpload: File | null = null;
    public previewFotoFachada = signal<string | null>(null);

    public connectionsTypes: Dropdown[] = [
        { name: 'Monofásica', code: '1' },
        { name: 'Bifásica', code: '2' },
        { name: 'Trifásica', code: '3' },
    ];

    public connectedVoltage: Dropdown[] = [
        { name: '110v', code: '1' },
        { name: '120/208v', code: '2' },
        { name: '120/240v', code: '3' },
        { name: '220/440v', code: '4' },
        { name: '13.200v', code: '5' },
    ];

    public loadClass: Dropdown[] = [
        { name: 'Residencial', code: '1' },
        { name: 'Comercial', code: '2' },
        { name: 'Industrial', code: '3' },
        { name: 'Oficial', code: '4' },
        { name: 'Provisional', code: '5' },
    ];
    public connectionClass: Dropdown[] = [
        { name: 'Aéreo', code: '1' },
        { name: 'Subterránea', code: '2' },
    ];

    public circuits: Dropdown[] = [
        { name: 'CBQ1', code: '1' },
        { name: 'CBQ2', code: '2' },
        { name: 'CCR1', code: '3' },
        { name: 'CCR2', code: '4' },
        { name: 'CCH1', code: '5' },
        { name: 'CCH2', code: '6' },
        { name: 'CR1', code: '7' },
        { name: 'CR2', code: '8' },
        { name: 'LRETLB01', code: '9' },
        { name: 'C1', code: '10' },
        { name: 'C2', code: '11' },
        { name: 'C3', code: '12' },
        { name: 'C4', code: '13' },
        { name: 'CC', code: '14' },
    ];

    public transformersTypes: Dropdown[] = [
        { name: 'Monofásico', code: '1' },
        { name: 'Bifásico', code: '2' },
        { name: 'Trifásico', code: '3' },
    ];

    public redExisting: Dropdown[] = [
        { name: 'Baja Tensión (BT)', code: '1' },
        { name: 'Media Tensión (MT)', code: '2' },
    ];

    public redExistingTypes: Dropdown[] = [
        { name: 'Abierta', code: '1' },
        { name: 'Trensada', code: '2' },
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
                        : this.responseRequestDetail()?.solicitudes?.estado === "Creada"
                          ? 'La solicitud no esta asignada'
                          : this.responseRequestDetail()?.solicitudes?.estado !== "Asignada"
                            ? 'La solicitud ya ha sido visitada'
                            : '';
            },
            error: () => {
                this.back.set(true);
                this.messageInfo = 'Código de solicitud no válido';
            },
        });

        this.visitForm = this.formBuilder.group({
            solicitud: this.requestNumber,
            fecha_visita_inicio: ['', Validators.required],
            fecha_visita_fin: ['', Validators.required],
            tipo_conexion: [null, Validators.required],
            tension_conectada: [null, Validators.required],
            clase_carga: [null, Validators.required],
            latitud_punto_instalacion: [null, [Validators.required, Validators.min(1.86), Validators.max(2.93)]],
            longitud_punto_instalacion: [null, [Validators.required, Validators.min(-73.0), Validators.max(-72.0)]],
            latitud_punto_conexion: [null, [Validators.required, Validators.min(1.86), Validators.max(2.93)]],
            longitud_punto_conexion: [null, [Validators.required, Validators.min(-73.0), Validators.max(-72.0)]],
            latitud_transformador: [null, [Validators.required, Validators.min(1.86), Validators.max(2.93)]],
            longitud_transformador: [null, [Validators.required, Validators.min(-73.0), Validators.max(-72.0)]],
            corriente_fecha_lectura: ['', Validators.required],
            corriente_x: [null, Validators.required],
            corriente_y: [null, Validators.required],
            corriente_z: [null, Validators.required],
            circuito: [null, Validators.required],
            nodo_poste: ['', Validators.required],
            placa_transformador: ['', Validators.required],
            tipo_transformador: [null, Validators.required],
            potencia_transformador: [null, Validators.required],
            red_existente: [null, Validators.required],
            tipo_red_existente: [null, Validators.required],
            observacion: [''],
        });

        /* this.configureFormForTypeRequest(); */

        this.rejectionForm = this.formBuilder.group({
            observacion: ['', Validators.required],
        });
    }
}
