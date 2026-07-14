import { Injectable } from '@angular/core';
import { apiGet, apiPost } from './api-client';

@Injectable({ providedIn: 'root' })
export class CheersService {
    sendCheers(id: number): Promise<any> {
        return apiPost('/cheers/sendCheers', { id });
    }

    deleteCheers(id: number): Promise<any> {
        return apiPost('/cheers/deleteCheers', { id });
    }

    getCheersByStickerId(id: number): Promise<any> {
        return apiGet(`/cheers/getCheers/${id}`);
    }
}
