import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    standalone: true,
    imports: [TooltipModule, ToastModule],
    selector: 'app-icon-copy',
    template: `
        <p-toast position="top-center" life="5000" preventOpenDuplicates="true" />
        <div
            (click)="copyText()"
            (keydown.enter)="copyText()"
            tabindex="0"
            role="button"
            [pTooltip]="tooltipText()"
            [tooltipPosition]="tooltipPosition()">
            <i class="pi pi-clipboard"></i>
        </div>
    `,
    styles: [
        `
            div {
                align-items: center;
                background-color: var(--gray-100);
                border-radius: 0.375rem;
                color: var(--gray-400);
                cursor: pointer;
                display: inline-flex;
                font-size: 1rem;
                height: 1.5rem;
                justify-content: center;
                padding: 0.1rem 0.3rem;
                transform: translateY(0.1rem);
                transition: all 0.2s ease-in-out;

                &:hover {
                    color: var(--text-color);
                    background-color: var(--gray-200);
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService],
})
export class IconCopyComponent {
    private messageService = inject(MessageService);

    public toCopy = input.required<string | number>();
    public tooltipPosition = input<string>('top');
    public tooltipText = input<string>('Copiar');

    /**
     * Copies the text to the clipboard.
     */
    public copyText (): void {
        navigator.clipboard.writeText(String(this.toCopy()));
        this.messageService.add({
            severity: 'success',
            summary: 'Copiado en el portapapeles',
            detail: this.toCopy().toString(),
        });
    }
}
