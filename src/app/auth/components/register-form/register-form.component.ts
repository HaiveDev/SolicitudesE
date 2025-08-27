import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss'],
    standalone: true,
    imports: [
        ButtonModule,
        CardModule,
        CheckboxModule,
        CommonModule,
        DividerModule,
        InputTextModule,
        KeyFilterModule,
        PasswordModule,
        ReactiveFormsModule,
        RouterModule,
        ToastModule,
    ],
    providers: [MessageService],
})
export class RegisterFormComponent implements OnInit {

    private formBuilder = inject(FormBuilder)
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private breakpointObserver = inject(BreakpointObserver);
    private router = inject(Router);
    
    public registerForm!: FormGroup;
    public keyPositionToast: 'mobile' | 'desktop' = 'desktop';
    public isLoading = false;

    /**
     *
     */
    public ngOnInit (): void {
        this.breakpointObserver.observe(['(max-width: 576px)']).subscribe(result => {
            if (result.matches) {
                this.keyPositionToast = 'desktop';
            } else {
                this.keyPositionToast = 'mobile';
            }
        });

        this.registerForm = this.formBuilder.group({
            username: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]+$/),
                    Validators.minLength(8),
                    Validators.maxLength(12),
                ],
            ],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10)]],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
                ],
            ],
            passwordConfirm: ['', Validators.required],
            terms: [false, Validators.requiredTrue],
        });
    }

    /**
     * Checks if the password contains at least one lowercase letter.
     * @returns {boolean} True if the password contains a lowercase letter, false otherwise.
     */
    public hasLowerCase (): boolean {
        return /[a-z]/.test(this.registerForm.get('password')?.value || '');
    }

    /**
     * Checks if the password contains at least one uppercase letter.
     * @returns {boolean} True if the password contains an uppercase letter, false otherwise.
     */
    public hasUpperCase (): boolean {
        return /[A-Z]/.test(this.registerForm.get('password')?.value || '');
    }

    /**
     * Checks if the password contains at least one numeric digit.
     * @returns {boolean} True if the password contains a numeric digit, false otherwise.
     */
    public hasNumber (): boolean {
        return /\d/.test(this.registerForm.get('password')?.value || '');
    }

    /**
     * Checks if the password contains at least one special symbol.
     * @returns {boolean} True if the password contains a special symbol, false otherwise.
     */
    public hasSymbol (): boolean {
        return /[@$!%*?&]/.test(this.registerForm.get('password')?.value || '');
    }

    /**
     * Checks if the password meets the minimum length requirement.
     * @returns {boolean} True if the password is at least 8 characters long, false otherwise.
     */
    public hasMinLength (): boolean {
        return (this.registerForm.get('password')?.value || '').length >= 8;
    }

    // Método para aplicar clases condicionales
    /**
     * Applies conditional classes based on whether a requirement is met.
     * @param {boolean} requirementMet - Indicates if the requirement is met.
     * @returns {string} The class to be applied.
     */
    public getClassForRequirement (requirementMet: boolean): string {
        return requirementMet ? 'text-green-500' : '';
    }

    // Método para verificar si las contraseñas coinciden
    /**
     * Checks if the password and password confirmation match.
     * @returns {boolean} True if the passwords match, false otherwise.
     */
    public get passwordsMatch (): boolean {
        return this.registerForm.get('password')?.value === this.registerForm.get('passwordConfirm')?.value;
    }

    /**
     * Handles the form submission.
     */
    public onSubmit (): void {
        if (this.registerForm.invalid || !this.passwordsMatch) {
            return;
        }
        this.isLoading = true;
        const { username, first_name, last_name, email, phone, password } = this.registerForm.value;
        this.authService.register(username, first_name, last_name, email, phone, password).subscribe({
            next: (message) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Registro exitoso',
                    detail: message.toString(),
                    key: this.keyPositionToast,
                });
                this.router.navigate(['/activar-cuenta']);
            },
            error: error => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                    key: this.keyPositionToast,
                });
            },
        });
    }
}
