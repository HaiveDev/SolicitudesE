import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RequestHistoryComponent } from '@components/request-history/request-history.component';
import { ResponseRequestHistory, RedirectionHistory } from '@interfaces/index';
import { RequestHistoryService } from '@services/request-history.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-dist-approver-history',
    standalone: true,
    imports: [RequestHistoryComponent, ToastModule, ProgressSpinnerModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-center" life="5000" preventOpenDuplicates="true" />
        <div class="card">
            @defer (when responseRequestHistory() !== null) {
                <app-request-history [redirection]="redirection" />
            } @placeholder {
                <div class="text-center">
                    <p-progressSpinner
                        styleClass="w-4rem"
                        strokeWidth="3"
                        fill="transparent"
                        animationDuration="0.5s" />
                    <h5 class="mt-1">Cargando historial de solicitudes...</h5>
                </div>
            }
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistApproverHistoryComponent implements OnInit, OnDestroy {
    private messageService = inject(MessageService);
    private requestHistoryService = inject(RequestHistoryService);

    public responseRequestHistory = signal<ResponseRequestHistory | null>(null);

    public redirection = RedirectionHistory.dist_aprobador;

    /**
     *
     */
    public ngOnInit (): void {
        if(this.requestHistoryService.responseRequestHistory() === null) {
            this.requestHistoryService.getRequestHistory().subscribe({
                next: ()/* results */ => {
                    /* this.responseRequestHistory.set(results); */
                    this.responseRequestHistory.set(this.requestHistoryService.responseRequestHistory());
                },
                error: error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    });
                },
            });
        }else{
            this.responseRequestHistory.set(this.requestHistoryService.responseRequestHistory());
        }
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Cancels any ongoing requests.
     */
    public ngOnDestroy (): void {
        this.requestHistoryService.cancelRequests();
    } 
}
