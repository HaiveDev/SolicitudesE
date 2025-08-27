import { AppLayoutComponent } from './layout/app.layout.component';
import { Routes } from '@angular/router';
import { checkAuthStatusGuard, isAuthenticatedGuard, isNotAuthenticatedGuard } from '@auth/guards';

export const routes: Routes = [
    {
        path: '',
        canActivate: [checkAuthStatusGuard, isAuthenticatedGuard],
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                title: 'Inicio',
                loadComponent: () =>
                    import('./features/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'solicitudes',
                title: 'Solicitudes Energuaviare',
                loadComponent: () => import('./features/solicitudes/solicitudes.component').then(m => m.SolicitudesComponent),
            },
            {
                path: 'historial',
                title: 'Historial solicitudes',
                loadComponent: () => import('./features/history/history.component').then(m => m.HistoryComponent),
            },
            {
                path: 'nueva-solicitud',
                title: 'Nueva Solicitud',
                loadChildren: () => import('./features/new-request/new-request.routes').then(m => m.RequestCreationFormRoutes),
            },
            {
                path: 'iniciar-matricula',
                title: 'Iniciar Matrícula',
                loadComponent: () => import('./features/start-enrollment/start-enrollment.component').then(m => m.StartEnrollmentComponent),
            },
            {
                path: 'historial/detalle-solicitud/:request-number',
                title: 'Detalle solicitud',
                loadComponent: () =>
                    import('./features/user-request-detail/user-request-detail.component').then(m => m.UserRequestDetailComponent),
            },
            {
                path: 'distribucion',
                title: 'Distribución',
                loadChildren: () => import('./features/distribution/distribution.routes').then(m => m.DistributionRoutes),
            },
            {
                path: 'comercial',
                title: 'Comercial',
                loadChildren: () => import('./features/commercial/commercial.routes').then(m => m.CommercialRoutes),
            },
            {
                path: 'cuenta',
                title: 'Cuenta',
                loadChildren: () => import('./features/account/account.routes').then(m => m.accountRoutes)
            },
        ],
        
    },
    {
        path: 'registro',
        canActivate: [checkAuthStatusGuard, isNotAuthenticatedGuard],
        loadComponent: () =>
            import('./auth/components/register-form/register-form.component').then(
                m => m.RegisterFormComponent
            ),
    },
    {
        path: 'iniciar-sesion',
        canActivate: [checkAuthStatusGuard, isNotAuthenticatedGuard],
        loadComponent: () =>
            import('./auth/components/login-form/login-form.component').then(m => m.LoginFormComponent),
    },
    {
        path: 'activar-cuenta',
        canActivate: [checkAuthStatusGuard, isNotAuthenticatedGuard],
        loadComponent: () =>
            import('./auth/components/activate-account/activate-account.component').then(
                m => m.ActivateAccountComponent
            ),
    },
    {
        path: 'cambiar-contrasena',
        canActivate: [checkAuthStatusGuard, isNotAuthenticatedGuard],
        loadComponent: () =>
            import('./auth/components/password-reset/password-reset.component').then(
                m => m.PasswordResetComponent
            ),
    },
    { path: 'historial/detalle-solicitud', redirectTo: '/historial', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' },
    { path: 'asd', redirectTo: '/iniciar-sesion', pathMatch: 'full' }
];
