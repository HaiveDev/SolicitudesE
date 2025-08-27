import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-com-approver-history',
    standalone: true,
    imports: [],
    template: `
        <p>com-approver-history works!</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComApproverHistoryComponent {}
