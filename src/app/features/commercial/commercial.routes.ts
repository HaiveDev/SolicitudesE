import { Routes } from '@angular/router';

import { ComCoordinatorHistoryComponent } from './coordinator/com-coordinator-history.component';
import { ComTechnicianHistoryComponent } from './technician/com-technician-history.component';
import { ComApproverHistoryComponent } from './approver/com-approver-history.component';

import { ComCoordinatorDetailComponent } from './coordinator/com-coordinator-detail.component';
import { ComTechnicianDetailComponent } from './technician/com-technician-detail.component';
import { ComApproverDetailComponent } from './approver/com-approver-detail.component';

export const CommercialRoutes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'coordinador', title: 'Coordinador distribución', component: ComCoordinatorHistoryComponent },
    { path: 'tecnico', title: 'Técnico distribución', component: ComTechnicianHistoryComponent },
    { path: 'aprobador', title: 'Aprobador distribución', component: ComApproverHistoryComponent },

    { path: 'coordinador/:request-number', title: 'Coordinador distribución', component:  ComCoordinatorDetailComponent},
    { path: 'tecnico/:request-number', title: 'Técnico distribución', component:  ComTechnicianDetailComponent},
    { path: 'aprobador/:request-number', title: 'Aprobador distribución', component:  ComApproverDetailComponent},
    {
        path: '**',
        redirectTo: '/',
    },
];
