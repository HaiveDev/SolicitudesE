import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '@auth/interfaces/auth.interface';
import { AuthService } from '@auth/services/auth.service';
import { AccountService } from '@services/account.service';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ButtonModule, InputTextModule, DialogModule, ReactiveFormsModule, MessagesModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-center" life="5000" preventOpenDuplicates="true" />
        <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="text-lg mb-2">Información personal</h2>
            <p-button (onClick)="showDialog()" label="Editar datos" />
        </div>
        <div class="grid formgrid p-fluid">
            <div class="field col-6 xl:col-4">
                <span>Nombres</span>
                <p class="text-gray-400">{{ dataUser?.first_name }}</p>
            </div>
            <div class="field col-6 xl:col-4">
                <span>Apellidos</span>
                <p class="text-gray-400">{{ dataUser?.last_name }}</p>
            </div>
            <div class="field hidden xl:block xl:col-4"></div>
            <div class="field col-12 md:col-6 xl:col-4">
                <span>Número de identificación</span>
                <p class="text-gray-400">{{ dataUser?.username }}</p>
            </div>
            <div class="field col-12 md:col-6 xl:col-4">
                <span>Teléfono</span>
                <p class="text-gray-400">{{ dataUser?.phone }}</p>
            </div>
            <div class="field col-12 md:col-6 xl:col-4">
                <span>Correo electrónico</span>
                <p class="text-gray-400">{{ dataUser?.email }}</p>
            </div>
        </div>

        <p-dialog styleClass="w-25rem" header="Editar perfil" [modal]="true" [(visible)]="visible" [draggable]="false" [resizable]="false" [dismissableMask]="true">
            <span class="p-text-secondary block mb-5">Actualizar información.</span>
            <form [formGroup]="infoForm" class="p-fluid formgrid grid mt-5" (ngSubmit)="onSubmit()">
                <div class="field col-12 sm:col-6">
                    <label for="first_name">Nombres</label>
                    <input id="first_name" type="text" pInputText formControlName="first_name" />
                </div>
                <div class="field col-12 sm:col-6">
                    <label for="last_name">Apellidos</label>
                    <input id="last_name" type="text" pInputText formControlName="last_name" />
                </div>
                <div class="field col-12">
                    <label for="username">Identificación</label>
                    <input id="username" type="text" pInputText [value]="dataUser?.username" disabled />
                </div>
                <div class="field col-12">
                    <label for="phone">Teléfono</label>
                    <input id="phone" type="text" pInputText formControlName="phone" />
                </div>
                <div class="field col-12">
                    <label for="email">Email</label>
                    <input id="email" type="text" pInputText [value]="dataUser?.email" disabled />
                </div>

                <div class="field col-12 flex justify-content-between gap-3 mt-4 mb-0">
                    <div class="w-full">
                        <p-button
                        label="Cancelar"
                        styleClass="p-button-outlined"
                        type="button"
                        (click)="visible = false" />
                    </div>
                    <div class="w-full">
                        <p-button
                            type="submit"
                            [disabled]="infoForm.invalid || !infoForm.dirty"
                            [loading]="isLoading"
                            styleClass="w-full"
                            [label]="isLoading ? '' : 'Guardar'">
                            <ng-template pTemplate="loadingicon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="spinner">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 6l0 -3" />
                                    <path d="M16.25 7.75l2.15 -2.15" />
                                    <path d="M18 12l3 0" />
                                    <path d="M16.25 16.25l2.15 2.15" />
                                    <path d="M12 18l0 3" />
                                    <path d="M7.75 16.25l-2.15 2.15" />
                                    <path d="M6 12l-3 0" />
                                    <path d="M7.75 7.75l-2.15 -2.15" />
                                </svg>
                            </ng-template>
                        </p-button>
                    </div>
                </div>
            </form>
        </p-dialog>
    `,
    styles: `
        :host ::ng-deep .p-dialog {
            max-width: 30rem !important;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
    public visible = false;
    public isLoading = false;
    public authService = inject(AuthService);
    public accountService = inject(AccountService);
    public dataUser: User | null = null;
    public infoForm!: FormGroup;

    private messageService = inject(MessageService);

    private fb = inject(FormBuilder);

    /**
     *
     */
    public ngOnInit (): void {
        this.dataUser = this.authService.currentUser();

        this.infoForm = this.fb.group({
            first_name: [this.dataUser?.first_name || '', Validators.required],
            last_name: [this.dataUser?.last_name || '', Validators.required],
            phone: [this.dataUser?.phone || '', Validators.required],
        });
    }

    /**
     *
     */
    public showDialog (): void {
        this.infoForm.reset({
            first_name: this.dataUser?.first_name || '',
            last_name: this.dataUser?.last_name || '',
            phone: this.dataUser?.phone || '',
        });
        this.visible = true;
    }

    /**
     *
     */
    public onSubmit (): void {
        if (this.isLoading || !this.infoForm.valid || !this.infoForm.dirty) return;

        this.isLoading = true;

        this.accountService.updateProfile(this.infoForm.value).subscribe({
            next: () => {
                // Actualizar localmente
                this.dataUser = {
                    ...this.dataUser!,
                    ...this.infoForm.value,
                };
                // this.authService.setUser(this.dataUser); // si aplica
                this.infoForm.markAsPristine(); // marca el form como sin cambios
                this.visible = false;
                this.isLoading = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Datos actualizados',
                    detail: 'Se han actualizado los datos correctamente',
                });
            },
            error: err => {
                console.error('Error al actualizar perfil', err);
                this.isLoading = false;
            },
        });
    }
}
