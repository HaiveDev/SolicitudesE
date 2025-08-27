import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, input } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { IconCopyComponent } from 'src/app/shared/ui/icon-copy.component';
import { Obras } from '@interfaces/request-detail.interface';
import { environment } from '@env/environment';

@Component({
    standalone: true,
    imports: [CommonModule, ImageModule, IconCopyComponent],
    selector: 'app-property-info',
    template: `
        <div class="grid formgrid p-fluid">
            <div class="field col-6">
                <span class="font-semibold">Certificado catastral</span>
                <p class="text-gray-400">
                    <!-- {{ dataProperty().certificado_catastral ? dataProperty().certificado_catastral : '000 000 000' }} -->
                      000 000 000
                </p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Nombre del proyecto</span>
                <p class="text-gray-400">
                    {{ dataProperty().nombre_proyecto ? dataProperty().nombre_proyecto : '- - - - - -' }}
                </p>
            </div>
            @if (dataProperty().codigo_cliente) {
                <div class="field col-6">
                    <span class="font-semibold">Código del cliente</span>
                    <p class="text-gray-400">
                        {{ dataProperty().codigo_cliente }}
                    </p>
                </div>
            }
            @if (dataProperty().archivo_factura) {
                <div [ngClass]="dataProperty().codigo_cliente ? 'field col-6' : 'field col-12'">
                    <span class="font-semibold">Archivo ultima factura</span>
                    <p>
                        <a
                            class="anchor-file"
                            target="_blank"
                            [href]="direccionBackendMedia + dataProperty().archivo_factura">
                            Ver archivo
                            <i class="pi pi-arrow-up-right"></i>
                        </a>
                    </p>
                </div>
            }
            <div class="field col-6">
                <span class="font-semibold">Zona</span>
                <p class="text-gray-400 truncate-bas">{{ dataProperty().zona | titlecase }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Dirección</span>
                <p class="text-gray-400">{{ dataProperty().direccion }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Barrio</span>
                <p class="text-gray-400">{{ dataProperty().direccion_barrio }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Centro poblado</span>
                <p class="text-gray-400 truncate-bas">{{ dataProperty().direccion_centro_poblado }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Municipio</span>
                <p class="text-gray-400 truncate-bas">{{ dataProperty().direccion_municipio | titlecase }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Sector</span>
                <p class="text-gray-400">{{ dataProperty().sector }}</p>
            </div>
            <div class="field col-12">
                <span class="font-semibold">Coordenadas</span>
                @if (dataProperty().latitud && dataProperty().longitud) {
                    <div class="flex gap-2 text-gray-400">
                        <p>{{ dataProperty().latitud }}, {{ dataProperty().longitud }}</p>
                        <span>|</span>
                        <app-icon-copy
                            [toCopy]="dataProperty().latitud + ', ' + dataProperty().longitud"
                            tooltipText="Copiar coordenadas" />
                        <span>|</span>
                        <span>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                class="anchor-file"
                                [href]="
                                    'https://www.google.com/maps?q=' +
                                    dataProperty().latitud +
                                    ',' +
                                    dataProperty().longitud
                                ">
                                Mapa
                                <i class="pi pi-arrow-up-right"></i>
                            </a>
                        </span>
                    </div>
                } @else {
                    <p class="text-gray-400">------ ------</p>
                }
            </div>
            <div class="field col-6">
                <span class="font-semibold">Tipo de carga</span>
                <p class="text-gray-400">{{ dataProperty().tipo_carga }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Uso</span>
                <p class="text-gray-400">{{ dataProperty().uso }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Carga nueva</span>
                <p class="text-gray-400">{{ dataProperty().carga_nueva }} kw</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Carga total</span>
                <p class="text-gray-400">{{ dataProperty().carga_total }} kw</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Medidores existentes</span>
                <p class="text-gray-400">{{ dataProperty().medidores_existentes }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Medidores nuevos</span>
                <p class="text-gray-400">{{ dataProperty().medidores_proyectados }}</p>
            </div>
            <div class="field col-12 md:col-6">
                <span class="font-semibold">Observación</span>
                <p class="text-gray-400">
                    {{
                        dataProperty().observacion
                            ? dataProperty().observacion
                            : 'No se ha indicado ninguna observación'
                    }}
                </p>
            </div>
            <div class="flex flex-column col-12 md:col-6">
                <span class="font-semibold">Foto fachada</span>
                <div class="flex gap-2 text-gray-400">
                    <p class="anchor-file truncate-bas">Abrir imagen</p>
                    <span>|</span>
                    <a
                        target="_blank"
                        class="anchor-file truncate-bas pr-1"
                        [href]="direccionBackendMedia + dataProperty().fachada_foto">
                        Abrir en nueva pestaña
                        <i class="pi pi-arrow-up-right"></i>
                    </a>
                </div>
                <p-image
                    [previewImageSrc]="direccionBackendMedia + dataProperty().fachada_foto"
                    alt="Foto fachada"
                    width="0"
                    height="0"
                    [preview]="true" />
            </div>
        </div>
    `,
    styles: [
        `
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
export class PropertyInfoComponent implements OnInit, OnDestroy {
    public dataProperty = input.required<Obras>();

    public direccionBackendMedia = environment.backendBaseUrl + '/media/';

    /**
     *
     */
    public constructor () {
        console.log('Component property-info created');
    }

    /**
     *
     */
    public ngOnInit (): void {
        console.log('Component property-info initialized');
    }

    /**
     *
     */
    public ngOnDestroy (): void {
        console.log('Component property-info destroyed');
    }
}
