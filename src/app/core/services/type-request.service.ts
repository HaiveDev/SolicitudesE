import { computed, Injectable, signal } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class TypeRequestService {
    private readonly SECRET_KEY = 'a7Dj4Lq9T5XpK2nC';

    private _typeRequest = signal<string | null>(this.retrieveTypeRequestFromStorage());
    private _currentTypeRequest = computed(() => 
        this.dataTypeRequests.find(item => item.value === this._typeRequest()) || null
    );

    private readonly dataTypeRequests = [
        { label: 'Factibilidad de Nuevo Servicio', value: 'nueva-conexion', code: 9 },
        { label: 'Factibilidad de Independización', value: 'independizacion', code: 11 },
        { label: 'Cambio de Medidor con Aumento de Carga', value: 'aumento-de-carga', code: 12 },
        { label: 'Factibilidad de provisional', value: 'provisional', code: 10 },
        /* { label: 'Retiro de sellos', value: 'retiro-de-sellos', code: 5 },
        { label: 'Instalación de sellos', value: 'instalacion-de-sellos', code: 6 },
        { label: 'Cambio medidor por daño', value: 'cambio-medidor-por-dano', code: 7 },
        { label: 'Cambio medidor por reubicación', value: 'cambio-medidor-por-reubicacion', code: 8 }, */
        { label: 'Disponibilidad', value: 'disponibilidad', code: 5 },
    ];

    public readonly currentTypeRequest = computed(() => this._currentTypeRequest());

    /**
     * Sets a new type request, updating the local storage and signal.
     * @param {string} type - The type request to set.
     * @returns {boolean} - Returns true if the type request was successfully set.
     */
    public setTypeRequest (type: string): boolean {
        const foundType = this.dataTypeRequests.find(item => item.value === type);
        if (!foundType || this._typeRequest() === type) {
            return false;
        }

        this._typeRequest.set(type);
        this.storeTypeRequestInStorage(type);
        return true;
    }

    /**
     * Clears the current type request and removes it from local storage.
     */
    public clearTypeRequest (): void {
        this._typeRequest.set(null);
        localStorage.removeItem('typeRequest');
    }

    /**
     * Checks if a given type is valid based on predefined requests.
     * @param {string} type - The type to validate.
     * @returns {boolean} - Returns true if valid, false otherwise.
     */
    public isAcceptedType (type: string): boolean {
        return this.dataTypeRequests.some(item => item.value === type);
    }

    /**
     * Retrieves and decrypts the type request from local storage.
     * @returns {string | null} - The decrypted type request, or null if unavailable.
     */
    private retrieveTypeRequestFromStorage (): string | null {
        const encrypted = localStorage.getItem('typeRequest');
        if (!encrypted) return null;

        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, this.SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Failed to decrypt type request:', error);
            return null;
        }
    }

    /**
     * Encrypts and stores the type request in local storage.
     * @param {string} type - The type request to store.
     */
    private storeTypeRequestInStorage (type: string): void {
        const encrypted = CryptoJS.AES.encrypt(type, this.SECRET_KEY).toString();
        localStorage.setItem('typeRequest', encrypted);
    }
}
