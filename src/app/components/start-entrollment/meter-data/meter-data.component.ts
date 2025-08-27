import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-meter-data',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DropdownModule, RadioButtonModule, InputTextModule, ButtonModule],
    templateUrl: './meter-data.component.html',
})
export class MeterDataComponent implements OnInit {
    private fb = inject(FormBuilder);
    public form!: FormGroup;
    public submitted = false;

    public tiposMedidor = [
        { name: 'Monofásico bifilar $15,550', value: 'monofasico_bifilar' },
        { name: 'Monofásico trifilar $164,273', value: 'monofasico_trifilar' },
        { name: 'Bifásico trifilar $411,600', value: 'bifasico_trifilar' },
        { name: 'Trifásico trifilar $472,000', value: 'trifasico_trifilar' },
    ];

    public cuotasFinanciacion = Array.from({ length: 9 }, (_, i) => ({
        name: `${i + 2} cuotas`,
        value: i + 2,
    }));

    /**
     *
     */
    public ngOnInit (): void {
        this.form = this.fb.group({
            adquiereEquipo: ['', Validators.required],
            tipoEquipo: [''],
            financiado: [''],
            numeroCuotas: [''],
        });
    }

    /**
     * @returns {boolean}
     */
    public isAdquiereSi (): boolean {
        return this.form.get('adquiereEquipo')?.value === 'si';
    }

    /**
     * @returns {boolean}
     */
    public isFinanciadoSi (): boolean {
        return this.form.get('financiado')?.value === 'si';
    }

    /**
     *
     */
    public submit (): void {
        this.submitted = true;
        if (this.form.invalid) return;

        console.log(this.form.value);
    }
}
