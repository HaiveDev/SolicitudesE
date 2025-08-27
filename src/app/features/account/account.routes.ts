import { Routes } from '@angular/router';
import { AccountComponent } from './account.component'; // el contenedor principal

export const accountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent, // este tiene <router-outlet> y navegación
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      {
        path: 'perfil',
        title: 'Cuenta',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
];
