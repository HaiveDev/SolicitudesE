import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-com-coordinator-history',
    standalone: true,
    imports: [],
    template: `
        <p>com-coordinator-history works!</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComCoordinatorHistoryComponent {}
