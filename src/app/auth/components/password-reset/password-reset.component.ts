import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ FormsModule, InputOtpModule, ButtonModule, PasswordModule, DividerModule, ReactiveFormsModule, RouterModule, InputTextModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetComponent implements OnInit {

  public value: any;
  public isLoading = false;
  private formBuilder = inject(FormBuilder)
  private router = inject(Router);
  public passwordResetForm!: FormGroup;

  /**
   *
   */
      public ngOnInit (): void {
          this.passwordResetForm = this.formBuilder.group({
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            username: ['', [Validators.required, Validators.minLength(8)]],
              password: [
                  '',
                  [
                      Validators.required,
                      Validators.minLength(8),
                      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
                  ],
              ],
              passwordConfirm: ['', Validators.required],
          });
      }

/**
 * Checks if the password contains at least one lowercase letter.
 * @returns {boolean} True if the password contains a lowercase letter, false otherwise.
 */
    public hasLowerCase (): boolean {
        return /[a-z]/.test(this.passwordResetForm.get('password')?.value || '');
    }

    /**
     * Checks if the password contains at least one uppercase letter.
     * @returns {boolean} True if the password contains an uppercase letter, false otherwise.
     */
    public hasUpperCase (): boolean {
        return /[A-Z]/.test(this.passwordResetForm.get('password')?.value || '');
    }

    /**
     * Checks if the password contains at least one numeric digit.
     * @returns {boolean} True if the password contains a numeric digit, false otherwise.
     */
    public hasNumber (): boolean {
        return /\d/.test(this.passwordResetForm.get('password')?.value || '');
    }

    /**
     * Checks if the password contains at least one special symbol.
     * @returns {boolean} True if the password contains a special symbol, false otherwise.
     */
    public hasSymbol (): boolean {
        return /[@$!%*?&]/.test(this.passwordResetForm.get('password')?.value || '');
    }

    /**
     * Checks if the password meets the minimum length requirement.
     * @returns {boolean} True if the password is at least 8 characters long, false otherwise.
     */
    public hasMinLength (): boolean {
        return (this.passwordResetForm.get('password')?.value || '').length >= 8;
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
        return this.passwordResetForm.get('password')?.value === this.passwordResetForm.get('passwordConfirm')?.value;
    }
   /**
   * Handles the form submission.
   */
    public onSubmit (): void {
        if (this.passwordResetForm.invalid || !this.passwordsMatch) {
            return;
        }
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
            console.log('Form Data:', this.passwordResetForm.value);
        }, 2000);
    }
}
