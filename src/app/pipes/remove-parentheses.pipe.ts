import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'removeParentheses',
    standalone: true,
})
export class RemoveParenthesesPipe implements PipeTransform {

    /**
     * Transforms the input string by removing any text within parentheses.
     * If the value is null, undefined, or not a string, it returns the value unchanged.
     *
     * @param {string | null | undefined} value - The input string to transform.
     * @returns The transformed string with parentheses and their content removed, or the original value if invalid.
     */
    public transform (value: string | null | undefined): string {
        if (typeof value !== 'string' || !value.trim()) {
            return value || '';
        }

        // Remove content within parentheses and trim the result.
        return value.replace(/\(.*?\)/g, '').trim();
    }
}
