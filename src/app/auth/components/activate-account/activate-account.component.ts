import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputOtpModule } from 'primeng/inputotp';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [InputOtpModule, ButtonModule, DividerModule, ReactiveFormsModule, RouterModule, FormsModule, InputTextModule, InputNumberModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivateAccountComponent {
    public activateAccountForm!: FormGroup;
    public isLoading = false;
    private formBuilder = inject(FormBuilder)
    private authService = inject(AuthService);
    private router = inject(Router);

    /**
    *
    */
    public ngOnInit (): void {
        this.activateAccountForm = this.formBuilder.group({
            codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            username  : ['',[Validators.required, Validators.minLength(8)]],
        });

        this.activateAccountForm.get('codigo')?.setValue(null);
    }

    /**
    * Handles the form submission.
    */
    public onSubmit (): void {
        if (this.activateAccountForm.invalid) {
            return;
        }
        this.isLoading = true;
        const { codigo, username } = this.activateAccountForm.value;
        this.authService.verifyAccount(codigo, username).subscribe({
            next: () => {
                this.isLoading = false;
                console.log('Cuenta activada correctamente');
                this.router.navigate(['/iniciar-sesion']);
            },
            error: (error) => {
                this.isLoading = false;
                console.log('Error:', error);
            }
        });
    }

    public onResendCode (): void {
        if (this.activateAccountForm.controls['username'].invalid) {
            return;
        }
        this.isLoading = true;
        const username = this.activateAccountForm.controls['username'].value;
        this.authService.resendCode(username).subscribe({
            next: () => {
                this.isLoading = false;
                console.log('Código reenviado correctamente');
            },
            error: (error) => {
                this.isLoading = false;
                console.log('Error:', error);
            }
        });
    }
}
