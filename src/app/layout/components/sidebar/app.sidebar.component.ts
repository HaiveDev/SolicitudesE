import { AppMenuComponent } from '../menu/app.menu.component';
import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    standalone: true,
    imports: [AppMenuComponent],
})
export class AppSidebarComponent {
    /**
     *
     * @param {LayoutService} layoutService
     * @param {ElementRef} el
     */
    public constructor (
        public layoutService: LayoutService,
        public el: ElementRef
    ) {}
}
