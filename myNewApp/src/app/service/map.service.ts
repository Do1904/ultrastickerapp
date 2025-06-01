import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private dataUrl = 'http://localhost:3000/maps';
    constructor(private http: HttpClient) { }

    getAllPins = async () => {
        try {
            const response = await axios.get(this.dataUrl + '/getAllPins');
            return response.data;
        } catch (error) {
            console.error('Error fetching stickers:', error);
            throw error;
        }
    }
}