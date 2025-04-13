import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class CheersService {
    private CheersUrl = 'http://localhost:3000/cheers/sendCheers';
    constructor(private http: HttpClient) { }

    sendCheers = async (id: number) => {
        try {
            const body = { id };
            const response = await axios.post(this.CheersUrl, body);
            return response.data;
        } catch (error) {
            console.error('Error sending cheers:', error);
            throw error;
        }
    }

    deleteCheers = async (id: number) => {
        try {
            const body = { id };
            const response = await axios.post(`http://localhost:3000/cheers/deleteCheers`, body);
            return response.data;
        } catch (error) {
            console.error('Error deleting cheers:', error);
            throw error;
        }
    }

    getCheersByStickerId = async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:3000/cheers/getCheers/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error uploading sticker:', error);
            throw error;
        }
    }
}