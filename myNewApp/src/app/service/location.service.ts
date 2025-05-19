import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    constructor() { }

    async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
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
}