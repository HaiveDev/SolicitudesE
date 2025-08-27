import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
    standalone: true,
    imports: [ImageModule],
    selector: 'app-image-opt-open',
    template: `
        <span class="font-semibold">{{ label() }}</span>
        <div class="flex gap-2 text-gray-400">
            <p class="anchor-file truncate-bas">Abrir imagen</p>
            <span>|</span>
            <a target="_blank" class="anchor-file truncate-bas" [href]="url()">
                Abrir en nueva pestaña
                <i class="pi pi-arrow-up-right"></i>
            </a>
        </div>
        <p-image [previewImageSrc]="url()" [alt]="label()" width="0" height="0" [preview]="true" />
    `,
    styles: [
        `
            p-image {
                height: 0;
                width: 0;
            }
            ::ng-deep .p-image-preview-indicator {
                transform: translateY(-3rem);
                color: transparent;
                height: 1rem !important;
                width: 6.5rem !important;
            }
            ::ng-deep .p-image-preview-container:hover > .p-image-preview-indicator {
                background: transparent;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageOptOpenComponent {
    public label = input.required<string>();
    public url = input.required<string>();
}
