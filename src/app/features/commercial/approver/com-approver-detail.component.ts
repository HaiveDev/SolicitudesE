import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-com-approver-detail',
    standalone: true,
    imports: [],
    template: `
        <p>com-approver-detail works!</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComApproverDetailComponent {}
