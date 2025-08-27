import { Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    public _config: AppConfig = {
        ripple: true,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'da',
        theme: 'tailwind-light',
        scale: 14,
    };

    public config = signal<AppConfig>(this._config);

    public state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<any>();

    public configUpdate$ = this.configUpdate.asObservable();

    public overlayOpen$ = this.overlayOpen.asObservable();

    /**
     *
     */
    public constructor () {
        effect(() => {
            const config = this.config();
            if (this.updateStyle(config)) {
                this.changeTheme();
            }
            this.changeScale(config.scale);
            this.onConfigUpdate();
        });
    }

    /**
     * @param {AppConfig} config
     * @returns {boolean} True if the style has changed, false otherwise.
     */
    public updateStyle (config: AppConfig) {
        return (
            config.theme !== this._config.theme ||
            config.colorScheme !== this._config.colorScheme
        );
    }

    /**
     *
     */
    public onMenuToggle () {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive =
                !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive =
                !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    /**
     *
     */
    public showProfileSidebar () {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    /**
     *
     */
    public showConfigSidebar () {
        this.state.configSidebarVisible = true;
    }

    /**
     * @returns {boolean} True if the menu mode is overlay, false otherwise.
     */
    public isOverlay () {
        return this.config().menuMode === 'overlay';
    }

    /**
     * @returns {boolean} True if the device is a desktop device, false otherwise.
     */
    public isDesktop () {
        return window.innerWidth > 991;
    }

    /**
     * @returns {boolean} True if the device is a mobile device, false otherwise.
     */
    public isMobile () {
        return !this.isDesktop();
    }

    /**
     *
     */
    public onConfigUpdate () {
        this._config = { ...this.config() };
        this.configUpdate.next(this.config());
    }

    /**
     *
     */
    public changeTheme () {
        const config = this.config();
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const themeLinkHref = themeLink.getAttribute('href')!;
        const newHref = themeLinkHref
            .split('/')
            .map((el) =>
                el == this._config.theme
                    ? (el = config.theme)
                    : el == `theme-${this._config.colorScheme}`
                    ? (el = `theme-${config.colorScheme}`)
                    : el
            )
            .join('/');

        this.replaceThemeLink(newHref);
    }
    /**
     *
     * @param {string} href
     */
    public replaceThemeLink (href: string) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(
            cloneLinkElement,
            themeLink.nextSibling
        );
        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
        });
    }

    /**
     *
     * @param {number} value
     */
    public changeScale (value: number) {
        document.documentElement.style.fontSize = `${value}px`;
    }
}
