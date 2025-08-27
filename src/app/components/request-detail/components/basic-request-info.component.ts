import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, input } from '@angular/core';

import { Solicitudes } from '@interfaces/index';
import { environment } from '@env/environment';

import { FormatDatePipe, RemoveParenthesesPipe } from '@pipes/index';
import { IconCopyComponent } from '@shared/ui/index';

@Component({
    standalone: true,
    imports: [CommonModule, IconCopyComponent, FormatDatePipe, RemoveParenthesesPipe],
    selector: 'app-basic-request-info',
    template: `
        <div class="grid formgrid p-fluid">
            <div class="field col-6">
                <span class="font-semibold">Numero de solicitud</span>
                <p class="text-gray-400">
                    {{ dataRequest().numero_solicitud }}
                    <app-icon-copy [toCopy]="dataRequest().numero_solicitud" [tooltipText]="'Copiar código'" />
                </p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Estado</span>
                <p class="text-gray-400">{{ dataRequest().estado }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Clase de solicitud</span>
                <p class="text-gray-400">{{ dataRequest().clase_display }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Tipo de Solicitud</span>
                <p class="text-gray-400">{{ dataRequest().tipo_display }}</p>
            </div>
            <div class="field col-12 sm:col-6">
                <span class="font-semibold">Fecha de creación</span>
                <p class="text-gray-400">{{ dataRequest().created_at | formatDate }}</p>
            </div>
            @if (dataRequest().reporte) {
                <div class="field col-12 sm:col-6">
                    <span class="font-semibold">Reporte</span>
                    <p>
                        <a class="anchor-file" target="_blank" [href]="direccionBackendMedia + dataRequest().reporte">
                            Ver reporte
                            <i class="pi pi-arrow-up-right"></i>
                        </a>
                    </p>
                </div>
            }
            <div class="field col-12">
                <span class="font-semibold">Solicitud creada por</span>
                <p class="text-gray-400">{{ dataRequest().usuario | removeParentheses | titlecase }}</p>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicRequestInfoComponent implements OnInit, OnDestroy {
    public dataRequest = input.required<Solicitudes>();

    public direccionBackendMedia = environment.backendBaseUrl + '/media/';

    /**
     *
     */
    public constructor () {
        console.log('Component basic-request-info created');
    }

    /**
     *
     */
    public ngOnInit (): void {
        console.log('Component basic-request-info initialized');
    }

    /**
     *
     */
    public ngOnDestroy (): void {
        console.log('Component basic-request-info destroyed');
    }
}
