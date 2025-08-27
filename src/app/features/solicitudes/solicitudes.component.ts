import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-solicitudes',
    standalone: true,
    imports: [FieldsetModule, CommonModule, InputTextModule, ButtonModule],
    templateUrl: './solicitudes.component.html',
    styleUrl: './solicitudes.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesComponent {
    public router = inject(Router);
    public items;

    /**
     *
     */
    public constructor () {
        this.items = [
            {
                label: 'Factibilidad de Nuevo Servicio',
                route: '/nueva-solicitud/nueva-conexion',
            },
            {
                label: 'Factibilidad de Independización',
                route: '/nueva-solicitud/independizacion',
            },
            {
                label: 'Factibilidad de provisional',
                route: '/nueva-solicitud/provisional',
            },
            {
                label: 'Cambio de Medidor con Aumento de Carga',
                route: '/nueva-solicitud/aumento-de-carga',
            },
            {
                label: 'Disponibilidad',
                route: '/nueva-solicitud/disponibilidad',
            }
        ]
    }
}
