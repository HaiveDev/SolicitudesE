import { Routes } from '@angular/router';
import { NewRequestComponent } from './new-request.component';
import { PersonalInfoFormComponent } from '../../components/create-request-form/personal-info-form/personal-info-form.component';
import { PropertyInfoFormComponent } from '../../components/create-request-form/property-info-form/property-info-form.component';
import { ConfirmationInfoComponent } from '../../components/create-request-form/confirmation-info/confirmation-info.component';
import { typeRequestGuard } from '@guards/index';

export const RequestCreationFormRoutes: Routes = [
    {
        path: ':tipo', component: NewRequestComponent, canActivate:[typeRequestGuard], children: [
            { path: '', redirectTo: 'informacion-personal', pathMatch: 'full' },
            { path: 'informacion-personal', component: PersonalInfoFormComponent },
            { path: 'informacion-inmueble', component: PropertyInfoFormComponent },
            { path: 'confirmar-informacion', component: ConfirmationInfoComponent },
        ]
    },
    {
        path: '**', redirectTo: '/solicitudes'
    }
];
