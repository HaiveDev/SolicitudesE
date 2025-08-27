import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDate',
    standalone: true,
})
export class FormatDatePipe implements PipeTransform {
    /**
     * Transforms a date string into a formatted date string.
     * @param {string} value - The date string to format.
     * @returns {string} The formatted date string.
     */
    public transform (value: string): string {
        const date = new Date(value);

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const dia = date.getDate().toString().padStart(2, '0');
        const mes = meses[date.getMonth()];
        const año = date.getFullYear();
        const hora = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        return `${dia} de ${mes} de ${año}, ${hora}`;
    }
}
