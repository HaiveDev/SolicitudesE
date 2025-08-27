import { Component, ViewChild, OnInit, inject, ChangeDetectionStrategy, input, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService } from 'primeng/api';

import { FormatDatePipe } from '@pipes/index';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ResponseRequestHistory, SolicitudesHistory, RedirectionHistory } from '@interfaces/index';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { RequestHistoryService } from '@services/request-history.service';
import { User } from '@auth/interfaces/auth.interface';
import { PaginatorComponent } from '@shared/ui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-request-history',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        DropdownModule,
        DropdownModule,
        FormatDatePipe,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        MultiSelectModule,
        TableModule,
        TagModule,
        ToastModule,
        TooltipModule,
        ProgressSpinnerModule,
        PaginatorComponent,
    ],
    templateUrl: './request-history.component.html',
    styleUrls: ['./request-history.component.scss'],
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestHistoryComponent implements OnInit, OnDestroy {
    @ViewChild('dt') public dt: Table | undefined;

    private router = inject(Router);
    private breakpointObserver = inject(BreakpointObserver);
    private authService = inject(AuthService);
    private requestHistoryService = inject(RequestHistoryService);
    private messageService = inject(MessageService);

    public responseRequestHistory = signal<ResponseRequestHistory | null>(null);
    public redirection = input<RedirectionHistory>(RedirectionHistory.user);
    
    public statuses!: { label: string; value: string }[];
    public optionsItemsPerPage!: { label: number; value: number }[];
    public currentPage: number = 1;
    public loadingRequestHistory: boolean = false;
    public totalRecords: number = 0;
    public searchValue: string | undefined;
    public requestHistory: SolicitudesHistory[] = [];

    public currentUser: User | null = null;

    /**
     *
     */
    public ngOnInit (): void {
        this.currentUser = this.authService.currentUser();
        
        if(this.responseRequestHistory() === null) {
            this.getRequestHistory();
        }

        const storedItemsPerPage = Number(localStorage.getItem('itemsPerPage'));
        if (storedItemsPerPage) {
            this.currentPage = storedItemsPerPage;
        }
    }

    /**
     * Fetches the request history from the service.
     * @param {number} page - Optional page number to fetch specific page of history.
     */
    public getRequestHistory (page?: number): void {
        console.log('Fetching request history for page:', page);
        this.requestHistoryService.getRequestHistory(page).subscribe({
            next:(response) => {
                this.responseRequestHistory.set(response);

                this.requestHistory = this.responseRequestHistory()!.results;
                this.totalRecords = this.responseRequestHistory()?.count || 0;

                this.requestHistory = this.requestHistory.map(item => ({
                    ...item,
                    creadoDate: item.creado ? new Date(item.creado) : new Date(0),
                }));
                this.loadingRequestHistory = false;
                /* this.responseRequestHistory.set(this.requestHistoryService.responseRequestHistory()); */
            },
            error: error => {
                this.loadingRequestHistory = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                });
            },
        });
    }

    /**
     * Handles the selection of a request.
     * @param {string} numberRequest - The number of the selected request.
     */
    public onRequestSelect (numberRequest: string) {
        switch (this.redirection()) {
            case RedirectionHistory.user:
                this.router.navigate(['/historial/detalle-solicitud', numberRequest]);
                break;
            case RedirectionHistory.dist_coordinador:
                this.router.navigate(['/distribucion/coordinador', numberRequest]);
                break;
            case RedirectionHistory.dist_tecnico:
                this.router.navigate(['/distribucion/tecnico', numberRequest]);
                break;
            case RedirectionHistory.dist_aprobador:
                this.router.navigate(['/distribucion/aprobador', numberRequest]);
                break;
        }
    }
    public onPageChange = (page: number) => {
        this.loadingRequestHistory = true;
        this.getRequestHistory(page);
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Cancels any ongoing requests.
     */
    public ngOnDestroy (): void {
        this.requestHistoryService.cancelRequests();
    }
}
