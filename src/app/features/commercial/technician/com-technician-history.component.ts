import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-com-technician-history',
    standalone: true,
    imports: [],
    template: `
        <p>com-technician-history works!</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComTechnicianHistoryComponent {}
