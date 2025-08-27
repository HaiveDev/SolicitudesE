import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-close-all-sessions',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule],
    providers: [ConfirmationService],
    template: `
        <h5 class="text-xl lg:text-2xl font-medium">Cerrar todas las sesiones</h5>
        <p>¿Estás seguro de que deseas cerrar todas las sesiones?</p>
        <p-button label="Cerrar Sesiones" styleClass="p-button-danger" (click)="confirmLogout()" />

        <p-confirmDialog #cd [position]="position" dismissableMask="true">
            <ng-template pTemplate="headless" let-message>
                <div class="flex flex-column align-items-center p-4 surface-overlay border-round-2xl w-25rem">
                    <div class="text-red-500 mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="currentColor">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                        </svg>
                    </div>
                    <span class="font-bold text-xl block mb-2 text-center text-balance">
                        {{ message.header }}
                    </span>
                    <p class="mb-0 text-center text-balance">{{ message.message }}</p>
                    
                    <div class="flex justify-content-between gap-3 mt-4 w-full">
                         <div class="w-full">
                            <p-button label="Cancelar" (click)="cd.reject()" styleClass="p-button-outlined w-full" />
                        </div>
                        <div class="w-full">
                            <p-button label="Confirmar" (click)="cd.accept()" styleClass="w-full" />
                        </div>
                    </div>
                </div>
            </ng-template>
        </p-confirmDialog>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseAllSessionsComponent implements OnInit {

    public position: string = 'center';
    private breakpointObserver = inject(BreakpointObserver);
    public confirmationService = inject(ConfirmationService);
    public authService = inject(AuthService);

    /**
     *
     */
    public ngOnInit () {
        this.breakpointObserver.observe(['(max-width: 576px)']).subscribe(result => {
            if (result.matches) {
                this.position = 'bottom';
            } else {
                this.position = 'center';
            }
        });
    }

    /**
     * Confirms the logout action with the user.
     */
    public confirmLogout () {
        this.confirmationService.confirm({
            header: '¿Desea cerrar todas las sesiones?',
            message:
                'Se cerrarán todas las sesiones activas, incluyendo esta. Los cambios no guardados se perderán.',
            accept: () => {
                this.authService.logoutAllSessions();
            },
            reject: () => true,
        });
    }
}
