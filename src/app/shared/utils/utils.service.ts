import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    /**
     * Truncates a string to a specified length and adds ellipsis ("...") in the middle
     * if the string exceeds the maximum length.
     *
     * @param {string} input - The string to be truncated.
     * @param {number} maxLength - The maximum allowed length of the string.
     * @returns {string} - The truncated string with ellipsis if necessary.
     */
    public truncateStringWithEllipsis (input: string, maxLength: number = 22): string {
        if (input.length > maxLength) {
            const start = input.substring(0, 10);
            const end = input.substring(input.length - 10, input.length);
            return `${start}...${end}`;
        }
        return input;
    }

    /**
     * Converts all numeric and null values in the given object to strings.
     * @template T The type of the input object.
     * @param {T} formValues - The object containing form values.
     * @returns {T} - A new object with all numeric and null values converted to strings.
     */
    public convertFormValuesToStrings<T extends Record<string, string | number | null | undefined>> (formValues: T): T {
        return Object.entries(formValues).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]: value === null || typeof value === 'number' ? (value ?? '').toString() : value,
            };
        }, {} as T);
    }

    /**
     *
     * @param {any} error
     * @returns {string}
     * @description Extracts the first error message from a possibly nested error object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public extractFirstErrorMessage (error: any): string {
    if (!error || typeof error !== 'object') return 'Ocurrió un error inesperado.';

    for (const key of Object.keys(error)) {
        const mensajes = error[key];
        if (Array.isArray(mensajes) && mensajes.length > 0) {
            return mensajes[0]; // devuelve el primer mensaje encontrado
            //TODO: y si hay más mensajes?
        }
    }

    return 'Error desconocido al procesar la solicitud.';
}

}
