import { Component, ElementRef, inject, OnInit, ViewChild, HostListener  } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '@auth/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { User } from '@auth/interfaces';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone: true,
    imports: [
        CommonModule,
        BadgeModule,
        ButtonModule,
        InputSwitchModule,
        MenuModule,
        DividerModule,
        RouterLink,
        FormsModule,
        ConfirmDialogModule,
    ],
    providers: [ConfirmationService],
    styles: [
        `
            .translate-xy{
                transform: translate(0.1rem, 1.7rem)
            }
        `,
    ],
})
export class AppTopBarComponent implements OnInit {
    @ViewChild('menubutton') public menuButton!: ElementRef;

    public layoutService = inject(LayoutService);
    public confirmationService = inject(ConfirmationService);
    public authService = inject(AuthService);
    private breakpointObserver = inject(BreakpointObserver);
    private router = inject(Router);

    public loadingAvatar: boolean = true;
    public position: string = 'center';
    public items!: MenuItem[];
    public dataUser: User | null = null;

    /**
     * Initializes the component
     */
    public ngOnInit (): void {

        this.dataUser = this.authService.currentUser();

        this.items = [
            {
                separator: true,
            },
            {
                label: 'Mi cuenta',
                icon: 'pi pi-user',
                command: () => {
                    this.router.navigate(['/cuenta/perfil']);
                },
            },
            {
                separator: true,
            },
            /* {
                label: 'Tutoriales',
                icon: 'pi pi-book',
                shortcut: '⌘+L',
            },
            {
                label: 'Cambiar contraseña',
                icon: 'pi pi-lock',
            },
            {
                label: 'Modo oscuro',
                icon: 'pi pi-moon',
                switchDarkMode: true,
            }, */
            
            {
                label: 'Solicitudes guardadas',
                icon: 'pi pi-bookmark',
            },
            {
                label: 'Preferencias',
                icon: 'pi pi-cog',
                shortcut: '⌘+,',
            },
            {
                separator: true,
            },
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                shortcut: '⌘+Q',
                command: () => {
                    this.confirmLogout();
                },
            },
            {
                separator: true,
            },
        ];

        this.breakpointObserver.observe(['(max-width: 576px)']).subscribe(result => {
            if (result.matches) {
                this.position = 'bottom';
            } else {
                this.position = 'center';
            }
        });
    }

    /**
     * Handles keyboard events for specific key combinations.
     * @param {KeyboardEvent} event - The keyboard event to be processed.
     */
    @HostListener('document:keydown', ['$event'])
    private handleKeyboardEvent (event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'q') {
        this.confirmLogout();
      }
    }

    /**
     * Confirms the logout action with the user.
     */
    private confirmLogout () {
        this.confirmationService.confirm({
            header: '¿Desea cerrar sesión?',
            message:
                'Todos los cambios no guardados se perderán y tendrá que iniciar sesión nuevamente para continuar.',
            accept: () => {
                this.authService.logout();
            },
            reject: () => true,
        });
    }
}
