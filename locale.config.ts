import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';

/**
 * Registers the locale data for es-CO.
 */
export function registerLocales (): void {
  registerLocaleData(localeEsCo);
}
