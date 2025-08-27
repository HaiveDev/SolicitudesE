import { Routes } from '@angular/router';

import { DistCoordinatorHistoryComponent } from './coordinator/dist-coordinator-history.component';
import { DistTechnicianHistoryComponent } from './technician/dist-technician-history.component';
import { DistApproverHistoryComponent } from './approver/dist-approver-history.component';

import { DistCoordinatorDetailComponent } from './coordinator/dist-coordinator-detail.component';
import { DistTechnicianDetailComponent } from './technician/dist-technician-detail.component';
import { DistApproverDetailComponent } from './approver/dist-approver-detail.component';

export const DistributionRoutes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'coordinador', title: 'Coordinador distribución', component: DistCoordinatorHistoryComponent },
    { path: 'tecnico', title: 'Técnico distribución', component: DistTechnicianHistoryComponent},
    { path: 'aprobador', title: 'Aprobador distribución', component: DistApproverHistoryComponent},

    { path: 'coordinador/:request-number', title: 'Coordinador distribución', component:  DistCoordinatorDetailComponent},
    { path: 'tecnico/:request-number', title: 'Técnico distribución', component:  DistTechnicianDetailComponent},
    { path: 'aprobador/:request-number', title: 'Aprobador distribución', component:  DistApproverDetailComponent},
    {
        path: '**',
        redirectTo: '/',
    },
];
