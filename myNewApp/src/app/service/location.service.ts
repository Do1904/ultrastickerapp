import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import * as L from 'leaflet';
import { isoToPrefecture } from '../const/prefecture';

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

    async convertToAddress(lat: number, lng: number): Promise<any> {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (!response.ok) {
            throw new Error('Failed to fetch address from OpenStreetMap');
        }
        const data = await response.json();
        const address = data.address || {};
        const addressOverview = data.display_name;
        console.info('Address data:', address);
        const prefecture =
            address.state || isoToPrefecture[address["ISO3166-2-lvl4"]] || null;
        console.info('Prefecture:', prefecture);
        const addressObject = {
            country: address.country || null,
            prefecture: prefecture,
            city: address.city || address.town || address.village || null,
            road: address.road || null,
            postcode: address.postcode || null,
            addressOverview: addressOverview || 'Address not found',
        };
        return addressObject;
    }
}