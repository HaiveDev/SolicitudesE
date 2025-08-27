import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';

import { ObraNewRequest } from '@interfaces/index';
import { NewRequestService, TypeRequestService } from '@services/index';

@Component({
    selector: 'app-readonly-property-info',
    standalone: true,
    imports: [CommonModule, FieldsetModule],
    templateUrl: './readonly-property-info.component.html',
    styles: [``],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadonlyPropertyInfoComponent implements OnInit {
    private newRequestService = inject(NewRequestService);
    private typeRequestService = inject(TypeRequestService);

    public propertyData!: ObraNewRequest;
    public typeCode: number | null = null;

    public departamento: string = '';
    public municipio: string = '';
    public centroPoblado: string = '';
    public sector: string = '';
    public tipoCarga: string = '';
    public uso: string = '';

    /**
     *
     */
    public ngOnInit (): void {
        this.propertyData = this.newRequestService.formNewRequest().obras;
        this.typeCode = this.typeRequestService.currentTypeRequest()?.code ?? null;

        const { departamentos, municipios, centros_poblados, sectores, tipoCargas, usos } = this.newRequestService;

        this.departamento = departamentos.find(d => d.code === this.propertyData.direccion_departamento)?.name || '';
        this.municipio = municipios.find(m => m.code === this.propertyData.direccion_municipio)?.name || '';
        this.centroPoblado =
            centros_poblados.find(c => c.code === this.propertyData.direccion_centro_poblado)?.name || '';
        this.sector = sectores.find(s => s.code === this.propertyData.sector)?.name || '';
        this.tipoCarga = tipoCargas.find(t => t.code === this.propertyData.tipo_carga)?.name || '';
        this.uso = usos.find(u => u.code === this.propertyData.uso)?.name || '';
    }
}
