import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '@services/account.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UtilsService } from '@shared/utils/utils.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, RouterLink, ToastModule, MessagesModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-center" life="5000" preventOpenDuplicates="true" />
        <h5 class="text-center mb-6 text-xl lg:text-2xl font-medium">Cambiar Contraseña</h5>
        <div class="flex justify-content-center align-items-center">
            <form class="grid formgrid gap-4 w-full lg:w-10" [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="col-12">
                    <label for="actual">Contraseña actual</label>
                    <input id="actual" type="password" pInputText formControlName="password_actual" class="w-full" />
                    <a class="anchor block mt-1 text-sm text-blue-500" routerLink="/forgot-password">
                        ¿Olvidó su contraseña?
                    </a>
                </div>

                <div class="col-12">
                    <label for="nueva">Nueva contraseña</label>
                    <input id="nueva" type="password" pInputText formControlName="nuevo_password" class="w-full" />
                </div>

                <div class="col-12">
                    <label for="confirmar">Confirmar contraseña</label>
                    <input
                        id="confirmar"
                        type="password"
                        pInputText
                        formControlName="confirm_password"
                        class="w-full" />
                    <small
                        class="text-red-500"
                        *ngIf="form.get('confirm_password')?.touched && form.hasError('mismatch')">
                        Las contraseñas no coinciden
                    </small>
                </div>

                <div class="col-12 text-center">
                    <p-button
                        type="submit"
                        label="Cambiar contraseña"
                        [disabled]="form.invalid || isLoading"
                        [loading]="isLoading"></p-button>
                </div>
            </form>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
    public accountService = inject(AccountService);
    public fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private utilsService = inject(UtilsService);

    public isLoading = false;

    public form: FormGroup = this.fb.group(
        {
            password_actual: ['', Validators.required],
            nuevo_password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', Validators.required],
        },
        { validators: this.passwordsMatchValidator }
    );

    /**
     * @param {FormGroup} form
     * @returns {ValidationErrors | null}
     */
    private passwordsMatchValidator (form: FormGroup) {
        const newPass = form.get('nuevo_password')?.value;
        const confirm = form.get('confirm_password')?.value;
        return newPass === confirm ? null : { mismatch: true }; 
    }

    /**
     *
     */
    public onSubmit (): void {
        if (this.isLoading || this.form.invalid) return;

        const { password_actual, nuevo_password } = this.form.value;

        this.isLoading = true;

        this.accountService.changePassword(password_actual, nuevo_password).subscribe({
            next: () => {
                console.log('Contraseña actualizada correctamente');
                this.form.reset();
                this.isLoading = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Contraseña cambiada correctamente',
                });
                // Opcional: redirigir o mostrar toast
            },
            error: err => {
                console.error('Error al cambiar contraseña', err);
                this.isLoading = false;

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: this.utilsService.extractFirstErrorMessage(err.error) || 'Error al cambiar contraseña',

                });
            },
        });
    }
}
