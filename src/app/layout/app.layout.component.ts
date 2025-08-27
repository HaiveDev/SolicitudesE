import { AppFooterComponent } from './components/footer/app.footer.component';
import { AppSidebarComponent } from './components/sidebar/app.sidebar.component';
import { AppTopBarComponent } from './components/topbar/app.topbar.component';
import { Component, OnDestroy, Renderer2, ViewChild, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ScrollTopModule } from 'primeng/scrolltop';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TypeRequestService } from '@services/index';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
    standalone: true,
    imports: [
        NgClass,
        AppTopBarComponent,
        AppSidebarComponent,
        RouterOutlet,
        AppFooterComponent,
        ScrollTopModule,
        BreadcrumbModule,
    ],
})
export class AppLayoutComponent implements OnInit, OnDestroy {

    public layoutService = inject(LayoutService);
    public renderer = inject(Renderer2);
    public router = inject(Router);
    public typeRequestService = inject(TypeRequestService);
    private cdr = inject(ChangeDetectorRef);

    public items: MenuItem[] | undefined;
    public overlayMenuOpenSubscription: Subscription;
    public menuOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) public appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) public appTopbar!: AppTopBarComponent;

    /**
     *
     */
    public constructor () {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(
                        this.appSidebar.el.nativeElement.isSameNode(event.target) ||
                        this.appSidebar.el.nativeElement.contains(event.target) ||
                        this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
                        this.appTopbar.menuButton.nativeElement.contains(event.target)
                    );

                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    /**
     *
     */
    public ngOnInit (): void {
        this.items = [{ label: 'Inicio', route: '/' }];

        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            this.updateBreadcrumb();
        });

        // Configurar el breadcrumb inicial
        this.updateBreadcrumb();
    }

    /**
     * Updates the breadcrumb based on the current router URL.
     */
    public updateBreadcrumb (): void {
        // Restablece el breadcrumb con el primer elemento fijo 'Inicio'
        this.items = [{ label: 'Inicio', route: '/' }];

        // Obtiene la ruta actual y la divide en segmentos
        const segments = this.router.url.split('/').filter(segment => segment);

        // Variable para construir la ruta acumulativa
        let accumulatedRoute = '';

        // Rutas que son excepciones y no deben tener URL en el breadcrumb
        const exceptionRoutes = [
            'distribucion',
            'comercial',
            'detalle-solicitud',
            'nueva-conexion',
            'independizacion',
            'provisional',
            'aumento-de-carga',
            'retiro-de-sellos',
            'instalacion-de-sellos',
            'cambio-medidor-por-dano',
            'cambio-medidor-por-reubicacion',
            'disponibilidad',
        ]; // Agrega aquí las rutas de excepción

        // Recorre cada segmento para construir dinámicamente el breadcrumb
        segments.forEach((segment, index) => {
            // Actualiza la ruta acumulada
            accumulatedRoute += `/${segment}`;

            // Convierte el segmento en un texto de título
            const label = this.formatBreadcrumbLabel(segment);

            // Verifica si el segmento es una excepción o el último segmento
            if (exceptionRoutes.includes(segment) || index === segments.length - 1) {
                // Agrega el item al breadcrumb sin URL
                this.items?.push({ label, tabindex: '-1' });
            } else {
                // Agrega el item al breadcrumb con URL
                this.items?.push({ label, route: accumulatedRoute,  });
            }
        });
    }

    /**
     * Formats a breadcrumb label by replacing hyphens with spaces and capitalizing each word.
     * @param {string}segment - The URL segment to format.
     * @returns The formatted breadcrumb label.
     */
    public formatBreadcrumbLabel (segment: string): string {
        return segment
            .replace(/-/g, ' ') // Reemplaza guiones por espacios
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitaliza cada palabra
    }

    /**
     * Hides the menu by resetting the layout service state and removing the outside click listener.
     */
    public hideMenu () {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.cdr.detectChanges(); // Forzar la detección de cambios
        this.unblockBodyScroll();
    }

    /**
     * Blocks the body scroll by adding a specific class to the body element.
     */
    public blockBodyScroll (): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    /**
     * Unblocks the body scroll by removing a specific class from the body element.
     */
    public unblockBodyScroll (): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(
                new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
                ' '
            );
        }
    }

    /**
     * Gets the container class based on the layout service configuration and state.
     * @returns An object representing the container class.
     */
    public get containerClass () {
        return {
            'layout-theme-light': this.layoutService.config().colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
            'layout-overlay': this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive':
                this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config().inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config().ripple,
        };
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Cleans up subscriptions and event listeners.
     */
    public ngOnDestroy () {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
