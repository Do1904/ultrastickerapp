import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../service/location.service';

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

  locationService: LocationService = inject(LocationService);

  constructor() { }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      this.L = await import('leaflet');

      this.map = L.map('map').setView([35.681236, 139.767125], 13);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

  onSearch(): void {
    const addressInput = (document.getElementById('address') as HTMLInputElement).value;
    if (addressInput) {
      this.moveToAddress(addressInput);
    }
  }

  async testGetLocation() {
    const cordinate = await this.locationService.getCurrentLocation();
    const pin = 'my home'; // ピンの名前
    this.addMarker(cordinate.lat, cordinate.lng, pin); // マーカーを追加
    this.moveToLocation(cordinate.lat, cordinate.lng); // 地図を移動
  }

  testPin(): void {
    const latitude = 51.5526994559; // 緯度
    const longitude = 7.06721973112; // 経度
    const pin = 'Veltins Arena'; // ピンの名前
    this.addMarker(latitude, longitude, pin); // マーカーを追加
    this.moveToLocation(latitude, longitude); // 地図を移動
  }

  addMarker(lat: number, lng: number, pin: string): void {
    const marker = this.L.marker([lat, lng]); // markerオブジェクトを作成
    marker.bindPopup(pin);
    marker.addTo(this.map); // markerをLeaflet地図に追加
  }

  moveToLocation(lat: number, lng: number): void {
    this.map.flyTo([lat, lng]);
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
