import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'app-progress-state-bar',
    standalone: true,
    imports: [ProgressBarModule, CommonModule],
    template: `
        <p-progressBar
            color="green"
            [styleClass]="this.status() === 'Anulada' ? 'hidden' : 'h-1rem'"
            [showValue]="false"
            [value]="requestProgress()" />

        <div class="flex justify-content-around mt-2">
            @if (this.status() !== 'Anulada') {
                <div class="text-center" [ngClass]="{ 'text-green-800': requestProgress() >= 25 }">
                    <i class="pi pi-receipt"></i>
                    <p>Creada</p>
                </div>
                <div class="text-center" [ngClass]="{ 'text-green-800': requestProgress() >= 50 }">
                    <i class="pi pi-user"></i>
                    <p>Asignada</p>
                </div>
                <div class="text-center" [ngClass]="{ 'text-green-800': requestProgress() >= 75 }">
                    <i class="pi pi-map-marker"></i>
                    <p>Visitada</p>
                </div>
                <div class="text-center" [ngClass]="{ 'text-green-800': requestProgress() >= 100 }">
                    <i class="pi pi-verified"></i>
                    <p>Finalizada</p>
                </div>
            } @else {
                <div class="text-center">
                    <p>Solicitud rechazada</p>
                </div>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStateBarComponent implements OnInit {

    public status = input<string>();
    public requestProgress = signal<number>(0);

    /**
     *
     */
    public ngOnInit (): void {
        this. requestProgress.set(this.getProgressFromStatus(this.status()!));
    }

    /**
     * Get the progress percentage based on the status.
     * @param {string | number} status - The status of the request.
     * @returns {number} - The progress percentage.
     */
    private getProgressFromStatus (status: string ): number {
        switch (status) {
            case "Creada":
                return 25;
            case "Asignada":
                return 50;
            case "Visitada":
                return 75;
            case "Finalizada":
                return 100;
            default:
                return 0;
        }
    }
}
