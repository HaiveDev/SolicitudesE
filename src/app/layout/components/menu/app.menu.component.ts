import { AppMenuitemComponent } from '../menuitem/app.menuitem.component';
import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { User } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [AppMenuitemComponent, DividerModule],
})
export class AppMenuComponent implements OnInit {
    public authService = inject(AuthService);

    public modelAdmin: any;
    public modelUser: any;
    public index!: number;

    public dataUser: User | null = null;

    /**
     *
     */
    public ngOnInit () {
        this.dataUser = this.authService.currentUser();
        this.modelUser = [
            {
                label: 'Home',
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ],
            },
            {
                label: 'Solicitudes factibilidad',
                items: [
                    {
                        label: 'Creación factibilidad',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/solicitudes'],
                    },
                    {
                        label: 'Detalle solicitud user',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/historial/detalle-solicitud/100000'],
                    },
                    {
                        label: 'Historial factibilidades',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/historial'],
                    },
                ],
            },
            {
                label: 'Solicitudes matricula',
                items: [
                    {
                        label: 'Creación matricula',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/solicitudes'],
                    },
                    {
                        label: 'Detalle solicitud user',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/historial/detalle-solicitud/100000'],
                    },
                    {
                        label: 'Historial matriculas',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/historial'],
                    },
                ],
            }
        ];
        this.modelAdmin = [
            {
                label: 'Home',
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                ],
            },
            {
                label: 'Solicitudes factibilidad',
                items: [
                    {
                        label: 'Creación factibilidad',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/solicitudes'],
                    },
                    {
                        label: 'Detalle solicitud user',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/historial/detalle-solicitud/100000'],
                    },
                    {
                        label: 'Historial factibilidades',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/historial'],
                    },
                ],
            },
            {
                label: 'Solicitudes matricula',
                items: [
                    {
                        label: 'Creación matricula',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/solicitudes'],
                    },
                    {
                        label: 'Detalle solicitud user',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/historial/detalle-solicitud/100000'],
                    },
                    {
                        label: 'Historial matriculas',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/historial'],
                    },
                ],
            },
            {
                label: 'Distribución',
                items: [
                    {
                        label: 'Coordinador',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/distribucion/coordinador'],
                    },
                    {
                        label: 'Técnico',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/distribucion/tecnico'],
                    },
                    {
                        label: 'Aprobador',
                        icon: 'pi pi-fw pi-receipt',
                        routerLink: ['/distribucion/aprobador'],
                    },
                ],
            },
            {
                label: 'Comercial',
                items: [
                    {
                        label: 'Coordinador',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/comercial/coordinador'],
                    },
                    {
                        label: 'Técnico',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/comercial/tecnico'],
                    },
                    {
                        label: 'Aprobador',
                        icon: 'pi pi-fw pi-receipt',
                        routerLink: ['/comercial/aprobador'],
                    },
                    {
                        label: 'Medidores',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/comercial/medidores'],
                    },

                ],
            },
        ];
    }
}
