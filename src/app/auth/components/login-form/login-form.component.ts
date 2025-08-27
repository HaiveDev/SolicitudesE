import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { BreakpointObserver } from '@angular/cdk/layout';
import { environment } from '@env/environment';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login-form',
    standalone: true,
    imports: [
        ButtonModule,
        CardModule,
        DividerModule,
        InputTextModule,
        KeyFilterModule,
        PasswordModule,
        ReactiveFormsModule,
        RouterModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private breakpointObserver = inject(BreakpointObserver);

    public loginForm!: FormGroup;
    public keyPositionToast: 'mobile' | 'desktop' = 'desktop';
    public isLoading = false;

    /**
     *
     */
    public ngOnInit (): void {
        this.loginForm = this.formBuilder.group({
            username: [environment.user, [Validators.required, Validators.minLength(8)]],
            password: [environment.password, [Validators.required, Validators.minLength(8)]],
        });

        this.breakpointObserver.observe(['(max-width: 576px)']).subscribe(result => {
            if (result.matches) {
                this.keyPositionToast = 'desktop';
            } else {
                this.keyPositionToast = 'mobile';
            }
        });
    }

    /**
     * Handles the form submission.
     */
    public onSubmit (): void {
        if (this.loginForm.invalid) {
            return;
        }
        this.isLoading = true;

        const { username, password } = this.loginForm.value;
        this.authService.login(username, password).subscribe({
            next: () => {
                const url = localStorage.getItem('url');
                this.router.navigateByUrl(url? url: '/');
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
