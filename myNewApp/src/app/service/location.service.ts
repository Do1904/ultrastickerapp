import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import { isoToPrefecture } from '../const/prefecture';

export interface AddressSearchResult {
  displayName: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  async getCurrentLocation(): Promise<LatLngLiteral> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve({
            lat: coords.latitude,
            lng: coords.longitude,
          });
        },
        (error) => reject(error)
      );
    });
  }

  /** 逆ジオコーディング(座標 → 住所) */
  async convertToAddress(lat: number, lng: number): Promise<any> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ja`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch address from OpenStreetMap');
    }
    const data = await response.json();
    const address = data.address || {};
    const addressOverview = data.display_name;
    const prefecture =
      address.province ||
      address.state ||
      isoToPrefecture[address['ISO3166-2-lvl4']] ||
      null;
    const addressObject = {
      country: address.country || null,
      state: prefecture,
      city: address.city || address.town || address.village || null,
      district: address.road || address.suburb || null,
      neighbourhood: address.neighbourhood || null,
      postcode: address.postcode || null,
      addressOverview: addressOverview || 'Address not found',
    };
    return addressObject;
  }

  /** 住所・地名検索(例: 渋谷、新宿、大阪)。日本国内を優先して検索する。 */
  async searchAddress(query: string): Promise<AddressSearchResult[]> {
    if (!query || query.trim().length === 0) return [];

    const url =
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=jp&limit=5&accept-language=ja&q=` +
      encodeURIComponent(query.trim());

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search address');
    }
    const data = await response.json();

    return (data as any[]).map((item) => ({
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  }
}
