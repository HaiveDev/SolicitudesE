import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
    template: `
        <!-- <div class="flex flex-column md:flex-row gap-2 justify-content-between align-items-center">
            <div class="flex flex-row align-items-center overflow-hidden gap-1">
                <p-button
                    type="button"
                    icon="pi pi-angle-left"
                    (click)="prevPage()"
                    [disabled]="currentPage() === 1"
                    [text]="true"
                    size="small" />

                @for (page of displayedPages(); track page;) {
                    <p-button
                        type="button"
                        styleClass="w-3rem"
                        size="small"
                        [outlined]="currentPage() !== page"
                        [label]="page === -1 ? '...' : page.toString()"
                        (click)="page !== -1 && goToPage(page)"
                        [disabled]="page === -1" 
                        [text]="page === -1" />
                }

                <p-button
                    type="button"
                    icon="pi pi-angle-right"
                    (click)="nextPage()"
                    [disabled]="currentPage() === totalPages()"
                    [text]="true"
                    size="small" />
            </div>

            <div class="flex align-items-center gap-2">
                <label for="goto">Ir a la página</label>
                <input
                    id="goto"
                    type="number"
                    pInputText
                    [(ngModel)]="gotoPageNumber"
                    (keydown.enter)="goToPage(gotoPageNumber)"
                    style="width: 4rem" />
            </div>
        </div> -->
        <div class="paginator-wrapper">
            <div class="paginator-buttons">
                <button
                    type="button"
                    (click)="prevPage()"
                    [disabled]="currentPage() === 1"
                    class="nav-button" >
                    <i class="pi pi-angle-left"></i>
                </button>

                @for (page of displayedPages(); track page;) {
                    <button
                        type="button"
                        class="page-button"
                        [class.active]="page === currentPage()"
                        [disabled]="page === -1"
                        (click)="page !== -1 && goToPage(page)">
                        {{ page === -1 ? '...' : page }}
                    </button>
                }

                <button
                    type="button"
                    (click)="nextPage()"
                    [disabled]="currentPage() === totalPages()"
                    class="nav-button" >
                    <i class="pi pi-angle-right"></i>
                </button>
            </div>

            <!-- <div class="paginator-goto">
                <label for="goto">Ir a la página</label>
                <input
                    id="goto"
                    type="number"
                    pInputText
                    [(ngModel)]="gotoPageNumber"
                    (keydown.enter)="goToPage(gotoPageNumber)" />
            </div> -->
        </div>
    `,
    styles: [
        `
        .paginator-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            margin: 1rem 0;
        }

        .paginator-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.25rem;
        }

        .page-button,
        .nav-button {
            width: 2rem;
            height: 2rem;
            font-size: 0.8rem;
            padding: 0;
            border: 1px solid var(--surface-border);
            border-radius: var(--border-radius);
            background: white;
            color: var(--text-color);
            cursor: pointer;
        }

        @media (min-width: 768px) {
            .page-button,
            .nav-button {
                width: 3rem;
                height: 3rem;
                font-size: 1rem;
            }
        }


        .page-button.active {
            background: var(--primary-color);
            color: white;
        }

        .page-button:disabled {
            cursor: default;
        }

        .paginator-goto {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .paginator-goto input {
            width: 4rem;
        }`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnInit {
    @Input() public totalItems = 0;
    @Input() public rowsPerPage = 20;
    @Output() public pageChange = new EventEmitter<number>();

    private breakpointObserver = inject(BreakpointObserver);

    public currentPage = signal(1);
    public gotoPageNumber = 1;
    public allPages = 7;
    public firstPages = 5;
    public lastPages = 5;
    public mediumPages = 1;

    public totalPages = computed(() => Math.ceil(this.totalItems / this.rowsPerPage));

    /**
     * Initializes the paginator component.
     */
    public ngOnInit (): void {
        this.breakpointObserver.observe(['(max-width: 1250px)']).subscribe(result => {
            if (result.matches) {
                this.allPages = 7;
                this.firstPages = 5;
                this.lastPages = 5;
                this.mediumPages = 1;
            } else {
                this.allPages = 15;
                this.firstPages = 13;
                this.lastPages = 12;
                this.mediumPages = 5;
            }
        });
    }
    /**
     *
     */
    public nextPage () {
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.update(v => v + 1);
            this.gotoPageNumber = this.currentPage();
            this.pageChange.emit(this.currentPage());
        }
    }

    /**
     *
     */
    public prevPage () {
        if (this.currentPage() > 1) {
            this.currentPage.update(v => v - 1);
            this.gotoPageNumber = this.currentPage();
            this.pageChange.emit(this.currentPage());
        }
    }

    /**
     *
     * @param {number} page
     */
    public goToPage (page: number) {
        const p = Math.max(1, Math.min(this.totalPages(), page));
        this.currentPage.set(p);
        this.gotoPageNumber = p;
        this.pageChange.emit(p);
    }

    /**
     * @returns {number[]} - The array of displayed page numbers.
     */
    public displayedPages (): number[] {
        const total = this.totalPages();
        const current = this.currentPage();
        const range: number[] = [];

        if (total <= this.allPages) {
            for (let i = 1; i <= total; i++) {
                range.push(i);
            }
            return range;
        }

        // Mostrar primeras 5 si estamos en el inicio
        if (current <= this.firstPages) {
            for (let i = 1; i <= this.firstPages; i++) {
                range.push(i);
            }
            range.push(-1); // ...
            range.push(total);
            return range;
        }

        // Mostrar última sección
        if (current >= total - this.lastPages) {
            range.push(1);
            range.push(-1); // ...
            for (let i = total - this.lastPages; i <= total; i++) {
                range.push(i);
            }
            return range;
        }

        // Mostrar segmento del medio
        range.push(1);
        range.push(-1); // ...
        for (let i = current - this.mediumPages; i <= current + this.mediumPages; i++) {
            range.push(i);
        }
        range.push(-1); // ...
        range.push(total);

        return range;
    }       

}
