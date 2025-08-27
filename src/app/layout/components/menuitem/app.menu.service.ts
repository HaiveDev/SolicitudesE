import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from '../../api/menuchangeevent';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    public menuSource$ = this.menuSource.asObservable();
    public resetSource$ = this.resetSource.asObservable();

    public onMenuStateChange (event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    public reset () {
        this.resetSource.next(true);
    }
}
