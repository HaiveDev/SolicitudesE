import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RequestDetailComponent } from '../../components/request-detail/request-detail.component';
import { RequestDetailService } from '../../core/services/request-detail.service';
import { ResultRequestDetail } from '@interfaces/index';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

@Component({
    selector: 'app-user-request-detail',
    standalone: true,
    imports: [CommonModule, RequestDetailComponent, ProgressSpinnerModule, ButtonModule, MessagesModule],
    templateUrl: './user-request-detail.component.html',
    styleUrl: './user-request-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRequestDetailComponent implements OnInit, OnDestroy {
    public router = inject(Router);
    private currentRoute = inject(ActivatedRoute);
    private requestDetailService = inject(RequestDetailService);

    private requestNumber: string | null = null;
    public responseRequestDetail = signal<ResultRequestDetail | null>(null);
    public back = signal<boolean>(false);
    public routeBack = '/historial';
    public messageInfo: string | null = null;

    /**
     *
     */
    public ngOnInit (): void {
        this.currentRoute.params.subscribe(params => {
            this.requestNumber = params['request-number'];
        });

        this.requestDetailService.getRequestDetails(this.requestNumber!).subscribe({
            next: results => {
                if (!results) {
                    this.back.set(true);
                    this.messageInfo = 'No se ha encontrado la solicitud solicitada';
                    return;
                }
                this.responseRequestDetail.set(results);
            },
            error: () => {
                this.back.set(true);
                this.messageInfo = 'Código de solicitud no válido';
            },
        });
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Cancels any ongoing requests.
     */
    public ngOnDestroy (): void {
        this.requestDetailService.cancelRequests();
    }
}
