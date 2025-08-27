import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@auth/services/auth.service';
import { User } from '@auth/interfaces/auth.interface';
import { AccountService } from '@services/account.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-change-email',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule, MessagesModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-center" life="5000" preventOpenDuplicates="true" />
        <h5 class="text-center mb-6 text-xl lg:text-2xl font-medium">Cambiar Correo Electrónico</h5>
        <div class="flex justify-content-center align-items-center">
            <form class="grid formgrid gap-4 w-full lg:w-10" [formGroup]="form" (ngSubmit)="onSubmit()">
                <!-- Correo actual -->
                <div class="col-12">
                    <label for="correo_actual">Correo actual</label>
                    <p class="text-gray-400">{{ dataUser?.email }}</p>
                </div>

                @if (!codeSend) {
                    <!-- Nuevo correo -->
                    <div class="col-12">
                        <label for="nuevo_correo">Nuevo correo</label>
                        <input id="nuevo_correo" type="email" pInputText class="w-full" formControlName="nuevo_email" />
                    </div>

                    <div class="col-12 flex flex-column gap-2">
                        <p-button
                            label="Solicitar código de verificación"
                            type="submit"
                            [disabled]="form.invalid || isLoading"
                            [loading]="isLoading" />
                        <small class="text-gray-400">
                            El código de verificación será enviado al correo actual: {{ dataUser?.email }}
                        </small>
                    </div>

                    <div class="text-blue-500 col-12 justify-content-end flex align-items-center gap-2">
                        <button
                            type="button"
                            class="cursor-pointer p-link bg-transparent border-0 text-blue-500"
                            (click)="codeSend = true">
                            Ingresar código de verificación
                        </button>
                        <i class="pi pi-angle-right"></i>
                    </div>
                } @else {
                    <div class="col-12">
                        <label for="code_verification">Código de verificación</label>
                        <input
                            id="code_verification"
                            type="text"
                            pInputText
                            maxlength="6"
                            placeholder="xxxxxx"
                            class="w-full"
                            formControlName="codigo" />
                    </div>

                    <div class="col-12 flex flex-column gap-2">
                        <p-button
                            label="Confirmar cambio de correo"
                            type="submit"
                            [disabled]="form.get('codigo')?.invalid || isLoading"
                            [loading]="isLoading" />
                    </div>

                    <div class="text-blue-500 col-12 justify-content-start flex align-items-center gap-2">
                        <i class="pi pi-angle-left"></i>
                        <span
                            class="cursor-pointer"
                            tabindex="0"
                            (click)="codeSend = false"
                            (keydown.enter)="codeSend = false"
                        >Volver</span>
                    </div>
                }
            </form>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeEmailComponent implements OnInit {
    public authService = inject(AuthService);
    public accountService = inject(AccountService);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);

    public dataUser: User | null = null;
    public isLoading = false;
    public codeSend = false;

    public form!: FormGroup;

    /**
     *
     */
    public ngOnInit (): void {
        this.dataUser = this.authService.currentUser();
        this.dataUser = this.authService.currentUser();

        this.form = this.fb.group({
            nuevo_email: ['', [Validators.email]],
            codigo: [''],
        });
    }

    /**
     *
     */
    public onSubmit (): void {
        if (this.isLoading) return;

        this.isLoading = true;

        if (!this.codeSend) {
            const email = this.form.get('nuevo_email')?.value;
            this.accountService.changeEmail(email).subscribe({
                next: () => {
                    console.log('Código enviado');
                    this.codeSend = true;
                    this.isLoading = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Código enviado',
                        detail: `Se ha enviado un código de verificación al correo ${this.dataUser?.email}`,
                    });
                },
                error: err => {
                    console.error('Error al solicitar cambio de correo', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error.nuevo_email[0] || 'Error al solicitar cambio de correo',
                    });
                    this.isLoading = false;
                },
            });
        } else {
            const codigo = this.form.get('codigo')?.value;
            this.accountService.confirmEmail(codigo).subscribe({
                next: () => {
                    this.isLoading = false;
                    // Opcional: actualizar el correo localmente
                    if (this.dataUser && this.form.get('nuevo_email')?.value) {
                        this.dataUser.email = this.form.get('nuevo_email')?.value;
                    }
                    this.codeSend = false;
                    this.form.reset();

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Correo actualizado',
                        detail: 'Se ha actualizado el correo correctamente',
                    });
                },
                error: err => {
                    console.error('Código incorrecto o expirado', err);
                    this.isLoading = false;
                },
            });
        }
    }
}
