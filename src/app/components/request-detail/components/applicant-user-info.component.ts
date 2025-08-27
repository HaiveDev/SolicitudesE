import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, input } from '@angular/core';
import { IconCopyComponent } from '../../../shared/ui/icon-copy.component';
import { UsuariosSolicitantes } from '@interfaces/request-detail.interface';
import { environment } from '@env/environment';

@Component({
    standalone: true,
    imports: [CommonModule, IconCopyComponent, DecimalPipe],
    selector: 'app-applicant-user-info',
    template: `
        <div class="grid formgrid p-fluid">
            <div class="field col-12">
                <span class="font-semibold">Nombre o razón social</span>
                <p class="text-gray-400">{{ dataUser().nombre | titlecase }}</p>
            </div>
            <!-- <div class="field col-12 sm:col-6">
                <span class="font-semibold">Tipo de identificación</span>
                <p class="text-gray-400">NIT</p>
            </div> -->
            <div class="field col-12 sm:col-6">
                <span class="font-semibold">Número de identificación</span>
                <p class="text-gray-400">{{ dataUser().numero_documento | number: '1.0-0' }}</p>
            </div>
            <!-- @if (true) {
                <div class="field col-12 sm:col-6">
                    <span class="font-semibold">Lugar de expedición</span>
                    <p class="text-gray-400">San Jose Del Guaviare</p>
                </div>
                <div class="field col-12 sm:col-6">
                    <span class="font-semibold">Fecha de expedición</span>
                    <p class="text-gray-400">21 de Febrero de 2021</p>
                </div>
            } @else if (false) {
                <div class="field col-12 sm:col-6">
                    <span class="font-semibold">Tipo de entidad</span>
                    <p class="text-gray-400">Publica</p>
                </div>
            } -->
            <div class="field col-12 sm:col-6">
                <span class="font-semibold">Archivo de identificación</span>
                <p>
                    <a class="anchor-file" target="_blank" [href]='direccionBackendMedia + dataUser().archivo_documento'>
                        Ver archivo
                        <i class="pi pi-arrow-up-right"></i>
                    </a>
                </p>
            </div>
            <!-- <div class="field col-12">
                <span class="font-semibold">Calidad del solicitante</span>
                <p class="text-gray-400">Otro</p>
            </div> -->
            <div class="field col-6">
                <span class="font-semibold">Celular 1</span>
                <p class="text-gray-400">{{ dataUser().celular1 }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Celular 2</span>
                <p class="text-gray-400">
                    {{ dataUser().celular2 ? dataUser().celular2 : '--- --- ----' }}
                </p>
            </div>
            <div class="field col-12 lg:col-6">
                <span class="font-semibold">Teléfono</span>
                <p class="text-gray-400">
                    {{ dataUser().telefono ? dataUser().telefono : '--- --- ----' }}
                </p>
            </div>
            <div class="field col-12 lg:col-6">
                <span class="font-semibold">Correo electrónico</span>
                <p class="text-gray-400 truncate-bas">
                    {{ dataUser().email }}
                    <app-icon-copy [toCopy]="dataUser().email" tooltipText="Copiar correo" />
                </p>
            </div>
            <div class="field col-12">
                <span class="font-semibold">Dirección</span>
                <p class="text-gray-400">{{ dataUser().direccion }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Barrio</span>
                <p class="text-gray-400 truncate-bas">{{ dataUser().direccion_barrio }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Centro poblado</span>
                <p class="text-gray-400 truncate-bas">{{ dataUser().direccion_centro_poblado }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Municipio</span>
                <p class="text-gray-400 truncate-bas">{{ dataUser().direccion_municipio | titlecase }}</p>
            </div>
            <div class="field col-6">
                <span class="font-semibold">Sector</span>
                <p class="text-gray-400">{{ dataUser().sector }}</p>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantUserInfoComponent implements OnInit, OnDestroy {

    public dataUser = input.required<UsuariosSolicitantes>();

    public direccionBackendMedia = environment.backendBaseUrl + '/media/';
    /**
     *
     */
    public constructor () {
        console.log('Component applicant-user-info created');
    }

    /**
     *
     */
    public ngOnInit (): void {
        console.log('Component applicant-user-info initialized');
    }

    /**
     *
     */
    public ngOnDestroy (): void {
        console.log('Component applicant-user-info destroyed');
    }
    
}
