import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from "primeng/toast";

import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { DeactivateAccountComponent } from './deactivate-account/deactivate-account.component';
import { CloseAllSessionsComponent } from './close-all-sessions/close-all-sessions.component';

@Component({
    standalone: true,
    selector: 'app-account',
    imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule,
    CardModule,
    DividerModule,
    MenubarModule,
    TabViewModule,
    ProfileComponent,
    ChangePasswordComponent,
    ChangeEmailComponent,
    DeactivateAccountComponent,
    CloseAllSessionsComponent,
    ToastModule
],
    template: `
        <div class="card">
            <p-tabView styleClass="tabview-custom">
                <p-tabPanel>
                    <ng-template pTemplate="header">
                        <div class="flex align-items-center gap-2">
                            <span class="font-bold white-space-nowrap m-0">Información personal</span>
                        </div>
                    </ng-template>

                    <app-profile />
                    <!-- This component is used to display and edit user profile information -->
                </p-tabPanel>
                <p-tabPanel header="Header II">
                    <ng-template pTemplate="header">
                        <div class="flex align-items-center gap-2">
                            <span class="font-bold white-space-nowrap m-0">Seguridad</span>
                        </div>
                    </ng-template>

                    

                    <div class="pt-4 grid justify-content-around gap-0">
                        <div class="lg:col-5 lg:mb-0 mb-6">
                            <app-change-email />
                        </div>

                        <p-divider styleClass="lg:col-2 hidden lg:block" layout="vertical" />

                        <div class="lg:col-5">
                            <app-change-password />
                        </div>
                    </div>
                    <p-divider />
                    <div class="pt-4 grid justify-content-around gap-0">
                        <div class="lg:col-5 lg:mb-0 mb-6">
                            <app-deactivate-account />
                        </div>

                        <p-divider styleClass="lg:col-2 hidden lg:block" layout="vertical" />

                        <div class="lg:col-5">
                            <app-close-all-sessions />
                        </div>
                    </div>
                    <!-- This component is used to deactivate the user's account -->
                </p-tabPanel>
            </p-tabView>
        </div>
    `,
})
export class AccountComponent {}
