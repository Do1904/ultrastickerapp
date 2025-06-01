import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../service/location.service';
import { MapService } from '../service/map.service';
import { Pin } from '../model/pin';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map
  private L: any;
  public lat: any;
  public lng: any;

  public pins: Pin[] = [];

  locationService: LocationService = inject(LocationService);
  mapService: MapService = inject(MapService);


  constructor() { }

  async ngOnInit() {
    console.info('ngOnInit called');
  }

  async pinAll(pins: Pin[]): Promise<void> {
    pins.forEach((pin: Pin) => {
      this.addMarker(pin.latitude, pin.longitude, pin.club);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    console.info('ngAfterViewInit called');
    this.L = await import('leaflet');

    if (typeof window !== 'undefined') {
      this.map = this.L.map('map').setView([35.681236, 139.767125], 13);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.pins = await this.getPinsInit();
      if (this.pins && this.pins.length > 0) {
        await this.pinAll(this.pins);
      } else {
        console.warn('No pins found to display on the map.');
      }
    }
  }

  onSearch(): void {
    const addressInput = (document.getElementById('address') as HTMLInputElement).value;
    if (addressInput) {
      this.moveToAddress(addressInput);
    }
  }

  async testGetLocation() {
    const coordinate = await this.getCurrentLocation();
    const pin = 'current coordinate'; // ピンの名前
    this.addMarker(coordinate.lat, coordinate.lng, pin); // マーカーを追加
    this.moveToLocation(coordinate.lat, coordinate.lng); // 地図を移動
  }

  testPin(): void {
    const latitude = 51.5526994559; // 緯度
    const longitude = 7.06721973112; // 経度
    const pin = 'Veltins Arena'; // ピンの名前
    this.addMarker(latitude, longitude, pin); // マーカーを追加
    this.moveToLocation(latitude, longitude); // 地図を移動
  }

  addMarker(lat: number, lng: number, pin: string): void {
    try {
      const marker = new this.L.marker([lat, lng])
        .bindPopup(pin);

      marker.addTo(this.map);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  }

  moveToLocation(lat: number, lng: number): void {
    this.map.flyTo([lat, lng]);
  }

  getPinsInit = async () => {
    try {
      const response = await this.mapService.getAllPins();
      return response;
    } catch (error) {
      console.error('Error uploading sticker:', error);
      throw error;
    }
  }

  async getCurrentLocation(): Promise<any> {
    const coordinate = await this.locationService.getCurrentLocation();
    return coordinate;
  }


  // 住所を指定して地図を移動するメソッド
  async moveToAddress(address: string): Promise<void> {
    try {
      // Nominatim APIを使用して住所を緯度経度に変換
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0]; // 最初の結果を使用
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        // 地図を指定した地点に移動
        this.map.setView([latitude, longitude], 13);

        // マーカーを追加
        this.L.marker([latitude, longitude]).addTo(this.map)
          .bindPopup(`Address: ${address}`)
          .openPopup();
      } else {
        console.error('住所が見つかりませんでした');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }
}
