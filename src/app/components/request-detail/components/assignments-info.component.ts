import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Asignaciones, Datos, Solicitudes } from '@interfaces/index';
import { environment } from '@env/environment';

import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { ImageModule } from 'primeng/image';

import { FormatDatePipe, RemoveParenthesesPipe } from '@pipes/index';
import { IconCopyComponent } from '@shared/ui/index';
import { MenuItem } from 'primeng/api';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        DividerModule,
        MessagesModule,
        ImageModule,
        FormatDatePipe,
        RemoveParenthesesPipe,
        IconCopyComponent,
    ],
    selector: 'app-assignments-info',
    template: `
        <div class="grid formgrid p-fluid">
            @if (!dataAsignacion()) {
                <div class="col-12">
                    <p-messages
                        [value]="[{ severity: 'info', detail: 'Parece que aún no se ha asignado la visita' }]"
                        [enableService]="false"
                        [closable]="false" />
                </div>
            } @else {
                <div class="field col-6">
                    <span class="font-semibold">Coordinador</span>
                    <p class="text-gray-400">{{ dataAsignacion().added_by | removeParentheses | titlecase }}</p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold">Estado asignación</span>
                    <p class="text-gray-400">{{ dataAsignacion().estado_asignacion }}</p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold">Fecha para visita</span>
                    <p class="text-gray-400">{{ dataAsignacion().fecha_agendamiento }}</p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold">Jornada</span>
                    <p class="text-gray-400">{{ dataAsignacion().jornada }}</p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold">Técnico 1</span>
                    <p class="text-gray-400">{{ dataAsignacion().tecnico1 | removeParentheses | titlecase }}</p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold">Técnico 2</span>
                    <p class="text-gray-400">{{ dataAsignacion().tecnico2 | removeParentheses | titlecase }}</p>
                </div>
                @if (dataAsignacion().tecnico3) {
                    <div class="field col-12">
                        <span class="font-semibold">Técnico 3</span>
                        <p class="text-gray-400">
                            {{ dataAsignacion().tecnico3 | removeParentheses | titlecase }}
                        </p>
                    </div>
                }
                <div class="field col-12 sm:col-6">
                    <span class="font-semibold">Observación</span>
                    <p class="text-gray-400">
                        {{
                            dataAsignacion().observacion
                                ? dataAsignacion().observacion
                                : 'No se ha indicado ninguna observación'
                        }}
                    </p>
                </div>
                <div class="field col-12 sm:col-6">
                    <span class="font-semibold">Fecha de creación de la asignación</span>
                    <p class="text-gray-400">{{ dataAsignacion().created_at | formatDate }}</p>
                </div>
            }
        </div>

        <p-divider [align]="'left'" type="solid" styleClass="mb-5">
            <b>Datos recolectados en la visita</b>
        </p-divider>

        <div class="grid formgrid p-fluid">
            @if (!dataVisita()) {
                <div class="col-12">
                    <p-messages
                        [value]="[{ severity: 'info', detail: 'Parece que la visita aún no se ha realizado' }]"
                        [enableService]="false"
                        [closable]="false" />
                </div>
            } @else {
                <div class="field col-6">
                    <span class="font-semibold">Inicio de la visita</span>
                    <p class="text-gray-400">{{ dataVisita().fecha_visita_inicio | formatDate }}</p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold">Fin de la visita</span>
                    <p class="text-gray-400">{{ dataVisita().fecha_visita_fin | formatDate }}</p>
                </div>
                <div class="field col-12 md:col-6">
                    <span class="font-semibold">Coordenadas punto de instalación</span>
                    <div class="flex gap-2 text-gray-400">
                        <p class="m-0">
                            {{ dataVisita().latitud_punto_instalacion }}, {{ dataVisita().longitud_punto_instalacion }}
                        </p>
                        <span>|</span>
                        <app-icon-copy
                            [toCopy]="
                                dataVisita().latitud_punto_instalacion + ', ' + dataVisita().longitud_punto_instalacion
                            "
                            tooltipText="Copiar coordenadas" />
                        <span>|</span>
                        <span>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                class="anchor-file"
                                [href]="
                                    'https://www.google.com/maps?q=' +
                                    dataVisita().latitud_punto_instalacion +
                                    ',' +
                                    dataVisita().longitud_punto_instalacion
                                ">
                                Mapa
                                <i class="pi pi-arrow-up-right"></i>
                            </a>
                        </span>
                    </div>
                </div>
                @if (dataRequest().tipo_display !== 'Disponibilidad') {
                    <div class="field col-12 md:col-6">
                        <span class="font-semibold">Coordenadas punto de conexión</span>
                        <div class="flex gap-2 text-gray-400">
                            <p class="m-0">
                                {{ dataVisita().latitud_punto_conexion }}, {{ dataVisita().longitud_punto_conexion }}
                            </p>
                            <span>|</span>
                            <app-icon-copy
                                [toCopy]="
                                    dataVisita().latitud_punto_conexion + ', ' + dataVisita().longitud_punto_conexion
                                "
                                tooltipText="Copiar coordenadas" />
                            <span>|</span>
                            <span>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="anchor-file"
                                    [href]="
                                        'https://www.google.com/maps?q=' +
                                        dataVisita().latitud_punto_conexion +
                                        ',' +
                                        dataVisita().longitud_punto_conexion
                                    ">
                                    Mapa
                                    <i class="pi pi-arrow-up-right"></i>
                                </a>
                            </span>
                        </div>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="font-semibold">Coordenadas transformador</span>
                        <div class="flex gap-2 text-gray-400">
                            <p class="m-0">
                                {{ dataVisita().latitud_transformador }}, {{ dataVisita().longitud_transformador }}
                            </p>
                            <span>|</span>
                            <app-icon-copy
                                [toCopy]="
                                    dataVisita().latitud_transformador + ', ' + dataVisita().longitud_transformador
                                "
                                tooltipText="Copiar coordenadas" />
                            <span>|</span>
                            <span>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="anchor-file"
                                    [href]="
                                        'https://www.google.com/maps?q=' +
                                        dataVisita().latitud_transformador +
                                        ',' +
                                        dataVisita().longitud_transformador
                                    ">
                                    Mapa
                                    <i class="pi pi-arrow-up-right"></i>
                                </a>
                            </span>
                        </div>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="font-semibold">Placa del transformador</span>
                        <p class="text-gray-400">{{ dataVisita().placa_transformador }}</p>
                    </div>
                    <div class="field col-6">
                        <span class="font-semibold truncate-avz">Tipo de transformador</span>
                        <p class="text-gray-400">{{ dataVisita().tipo_transformador }}</p>
                    </div>
                    <div class="field col-6">
                        <span class="font-semibold truncate-avz">Potencia del transformador</span>
                        <p class="text-gray-400">{{ dataVisita().potencia_transformador }} kVA</p>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="font-semibold">Fecha de lectura de corriente</span>
                        <p class="text-gray-400">{{ dataVisita().corriente_fecha_lectura | formatDate }}</p>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="font-semibold">Corrientes</span>
                        <p class="text-gray-400 text-color-span">
                            <span>X:</span>
                            {{ dataVisita().corriente_x }} |
                            <span>Y:</span>
                            {{ dataVisita().corriente_y }} |
                            <span>Z:</span>
                            {{ dataVisita().corriente_z }}
                        </p>
                    </div>
                    <div class="field col-6">
                        <span class="font-semibold">Circuito</span>
                        <p class="text-gray-400">{{ dataVisita().circuito }}</p>
                    </div>
                    <div class="field col-6">
                        <span class="font-semibold">Nodo del poste</span>
                        <p class="text-gray-400">{{ dataVisita().nodo_poste }}</p>
                    </div>
                    <div class="field col-6">
                        <span class="font-semibold">Red existente</span>
                        <p class="text-gray-400">{{ dataVisita().red_existente }}</p>
                    </div>
                    <div class="field col-6">
                        <span class="font-semibold truncate-avz">Tipo de red existente</span>
                        <p class="text-gray-400">{{ dataVisita().tipo_red_existente }}</p>
                    </div>
                }
                @for (foto of fotos(); track foto.label; let last = $last) {
                    <div [class]="'flex flex-column col-12' + (!last ? ' md:col-6' : '')">
                        <span class="font-semibold">{{ foto.label }}</span>
                        <div class="flex gap-2 text-gray-400">
                            <p class="anchor-file truncate-bas">Abrir imagen</p>
                            <span>|</span>
                            <a target="_blank" class="anchor-file truncate-bas pr-1" href="{{ foto.url }}">
                                Abrir en nueva pestaña
                                <i class="pi pi-arrow-up-right"></i>
                            </a>
                        </div>
                        <p-image
                            previewImageSrc="{{ foto.url }}"
                            alt="{{ foto.label }}"
                            width="0"
                            height="0"
                            [preview]="true" />
                    </div>
                }
                <div class="field col-12">
                    <span class="font-semibold truncate-avz">Observación</span>
                    <p class="text-gray-400">
                        {{
                            dataVisita().observacion
                                ? dataVisita().observacion
                                : 'No se ha indicado ninguna observación'
                        }}
                    </p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold truncate-avz">Fecha envío datos</span>
                    <p class="text-gray-400">{{ dataVisita().created_at | formatDate }}</p>
                </div>
                <div class="field col-6">
                    <span class="font-semibold truncate-avz">Datos enviados por</span>
                    <p class="text-gray-400">{{ dataVisita().added_by | removeParentheses | titlecase }}</p>
                </div>
            }
        </div>
    `,
    styles: [
        `
            ::ng-deep .p-message {
                margin-top: 0;
            }
            ::ng-deep .text-color-span > span {
                font-weight: 600;
                color: var(--text-color);
            }
            p-image {
                height: 0;
                width: 0;
            }
            ::ng-deep .p-image-preview-indicator {
                transform: translateY(-3rem);
                color: transparent;
                height: 1rem !important;
                width: 6.5rem !important;
            }
            ::ng-deep .p-image-preview-container:hover > .p-image-preview-indicator {
                background: transparent;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentsInfoComponent implements OnInit, OnDestroy {
    public dataRequest = input.required<Solicitudes>();
    public dataAsignacion = input.required<Asignaciones>();
    public dataVisita = input.required<Datos>();

    public fotos = signal<MenuItem[]>([]);

    public direccionBackendMedia = environment.backendBaseUrl + '/media/';

    /**
     *
     */
    public ngOnInit (): void {
        const fotosData: { label: string; key: keyof Datos }[] =
            this.dataRequest().tipo_display === 'Disponibilidad'
                ? [{ label: 'Foto fachada', key: 'fachada_foto' }]
                : [
                    { label: 'Foto fachada', key: 'fachada_foto' },
                    { label: 'Foto nodo', key: 'nodo_foto' },
                    { label: 'Foto transformador', key: 'transformador_foto' },
                ];
        if (this.dataVisita()) {
            this.fotos.set(
                fotosData.map(foto => ({
                    label: foto.label,
                    url: this.direccionBackendMedia + this.dataVisita()[foto.key],
                }))
            );
        }
    }

    /**
     *
     */
    public ngOnDestroy (): void {
        console.log('Component assignments-info destroyed');
    }
}
