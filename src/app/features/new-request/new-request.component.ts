import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { StepsModule } from 'primeng/steps';
import { TypeRequestService } from '../../core/services/type-request.service';
import { NewRequestService } from '@services/new-request.service';

@Component({
    selector: 'app-new-request',
    standalone: true,
    imports: [StepsModule],
    templateUrl: './new-request.component.html',
    styles: [
        `
            ::ng-deep .p-steps .p-steps-item .p-menuitem-link {
                padding: 0.327rem;
            }
        `,
    ],
})
export class NewRequestComponent implements OnInit, OnDestroy {
    private typeRequestService = inject(TypeRequestService);
    private newRequestService = inject(NewRequestService);

    public requestType!: { label: string; value: string; code: number } | null;
    public items: MenuItem[] = [];

    /**
     *
     */
    public ngOnInit () {
        this.setTypeRequestFrom();

        this.items = [
            {
                label: 'Usuario',
                routerLink: 'informacion-personal',
                tabindex: '-1',
            },
            {
                label: 'Obra / Inmueble',
                routerLink: 'informacion-inmueble',
                tabindex: '-1',
            },
            {
                label: 'Confirmar',
                routerLink: 'confirmar-informacion',
                tabindex: '-1',
            },
        ];
    }

    /**
     *
     */
    public setTypeRequestFrom () {
        this.requestType = this.typeRequestService.currentTypeRequest(); //TODO: Eliminar typeFeasibility ya que solo va a estar typo de solicitud
        if (this.requestType) {
            let typeFormulario = '';
            const typeRequestCode = this.requestType.code.toString();
            switch (this.requestType.code) {
                case 9:
                    typeFormulario = '1';
                    break;
                case 11:
                    typeFormulario = '11'; //TODO ! Revisar los tipos de formularios con los tipos de solicitudes
                    break;
                case 12:
                    typeFormulario = '31';
                    break;
                case 10:
                    typeFormulario = '21';
                    break;

                case 5:
                    typeFormulario = '41';
                    break;
            }
            this.newRequestService.formNewRequest().configuracion_solicitud.tipo_formulario = typeFormulario;
            this.newRequestService.formNewRequest().configuracion_solicitud.tipo_solicitud = typeRequestCode;
            console.log(this.newRequestService.formNewRequest());
        }
    }

    /**
     *
     */
    public ngOnDestroy () {
        console.log('Destroy NewRequestComponent');
        this.typeRequestService.clearTypeRequest();
    }
}
