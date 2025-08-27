import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-com-coordinator-detail',
    standalone: true,
    imports: [],
    template: `
        <p>com-coordinator-detail works!</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComCoordinatorDetailComponent {}
