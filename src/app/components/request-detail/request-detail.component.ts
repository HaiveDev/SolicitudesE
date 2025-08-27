import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

import { Asignaciones, Datos, Obras, ResultRequestDetail, Solicitudes, UsuariosSolicitantes } from '@interfaces/index';

import { BasicRequestInfoComponent } from './components/basic-request-info.component';
import { ApplicantUserInfoComponent } from './components/applicant-user-info.component';
import { PropertyInfoComponent } from './components/property-info.component';
import { AssignmentsInfoComponent } from './components/assignments-info.component';
import { ProgressStateBarComponent } from './components/progress-state-bar.component';
import { AccordionModule } from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-request-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        PanelModule,
        AccordionModule,
        MessagesModule,
        DividerModule,
        BasicRequestInfoComponent,
        ApplicantUserInfoComponent,
        PropertyInfoComponent,
        AssignmentsInfoComponent,
        ProgressStateBarComponent,
    ],
    templateUrl: './request-detail.component.html',
    styleUrl: './request-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailComponent implements OnInit {
    public router = inject(Router);
    public responseRequestDetail = input<ResultRequestDetail | null>();
    public routeBack = input.required<string>();

    public status: string = '0';
    public rejectMessage: string = '';

    public infoSolicitud?: Solicitudes;
    public infoUsuario?: UsuariosSolicitantes;
    public infoObra?: Obras;
    public infoAsignaciones?: Asignaciones;
    public infoVisita?: Datos;

    /**
     *
     */
    public ngOnInit (): void {
        this.infoSolicitud = this.responseRequestDetail()?.solicitudes;
        this.infoUsuario = this.responseRequestDetail()?.usuarios_solicitantes;
        this.infoObra = this.responseRequestDetail()?.obras;
        this.infoAsignaciones = this.responseRequestDetail()?.asignaciones;
        this.infoVisita = this.responseRequestDetail()?.datos;

        this.status = this.infoSolicitud?.estado ?? '0';

        this.rejectMessage = this.infoSolicitud?.rechazo_observacion
            ? this.infoSolicitud.rechazo_observacion
                  .toLowerCase()
                  .replace(/^\w/, c => c.toUpperCase())
            : '';
    }
}
