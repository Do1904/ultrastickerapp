import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import * as L from 'leaflet';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    constructor() { }

    async getCurrentLocation(): Promise<LatLngLiteral> {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser.');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const location = {
                        lat: coords.latitude,
                        lng: coords.longitude,
                    };
                    console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
                    resolve(location);
                },
                (error) => reject(error)
            );
        });
    }

    async convertToAddress(lat: number, lng: number): Promise<string> {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (!response.ok) {
            throw new Error('Failed to fetch address from OpenStreetMap');
        }
        const data = await response.json();
        return data.display_name || 'Address not found';
    }
}