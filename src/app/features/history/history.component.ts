import { Component } from '@angular/core';
import { RequestHistoryComponent } from '@components/request-history/request-history.component';

import { MessageService } from 'primeng/api';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [RequestHistoryComponent, ProgressSpinnerModule, ToastModule],
    providers: [MessageService],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
})
export class HistoryComponent {
 
}
