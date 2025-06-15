import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../service/location.service';
import { MapService } from '../service/map.service';
import { Pin } from '../model/pin';
import { Router } from '@angular/router';

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
  public selectedPin: Pin | null = null;

  locationService: LocationService = inject(LocationService);
  mapService: MapService = inject(MapService);

  constructor(private router: Router) { }



  async ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    // this.L = await import('leaflet');

    if (typeof window !== 'undefined') {
      const L = await import('leaflet'); // <-- ここをwindowガードの中に移す
      this.L = L;

      this.map = this.L.map('map').setView([35.681236, 139.767125], 13);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">©OpenStreetMap</a> contributors, Tiles: <a href="http://map.hotosm.org/" target="_blank">©HOT</a>'
      }).addTo(this.map);

      this.pins = await this.getPinsInit();
      if (this.pins && this.pins.length > 0) {
        await this.pinAll(this.pins);
      } else {
        console.warn('No pins found to display on the map.');
      }

      this.map.on('click', this.onMapClick.bind(this)); // 地図クリックイベントの設定
    }
  }

  onMapClick(event: L.LeafletMouseEvent): void {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    const popupContent = `
      <div style="text-align: center;">
        <h2>Selected Location</h2>
        <button mat-raised-button="elevated" >この位置でステッカーを登録する</button>
      </div>`; // ピンのポップアップ画面表示を設定

    const pin: Pin = {
      latitude: lat,
      longitude: lng,
      club: 'Unknown',
      league: 'Unknown',
      isClean: true,
      sticker: '',
      userId: 1, // 仮のユーザーID
      id: 0 // 仮のID
    };

    // ここは本来はベつのマーカーを表示する予定。pin も特に必要ないため今後は削除する予定

    this.addMarker(lat, lng, popupContent, pin); // マーカーを追加
    this.moveToLocation(lat, lng); // 地図を移動
  }

  onSearch(): void {
    const addressInput = (document.getElementById('address') as HTMLInputElement).value;
    if (addressInput) {
      this.moveToAddress(addressInput);
    }
  }

  showMarkerDetail(pin: Pin) {
    console.info('Selected Pin:', pin);
    this.selectedPin = pin;
    // ここで詳細画面component表示などの処理を行う
  }

  async pinAll(pins: Pin[]): Promise<void> {
    pins.forEach((pin: Pin) => {
      const popupContent = `
      <div style="text-align: center;">
        <h2>${pin.club}</h2>
        <p>${pin.league}</p>
        <p><a href="https://maps.google.com/maps?ll=${pin.latitude},${pin.longitude}&q=${pin.latitude},${pin.longitude}" target="_blank">Find this location on Google Map</a></p>
      </div>`; // ピンのポップアップ画面表示を設定
      this.addMarker(pin.latitude, pin.longitude, popupContent, pin);
    });
  }

  addMarker(lat: number, lng: number, popUpContent: string, pin: Pin): void {
    try {
      const marker = new this.L.marker([lat, lng])
        .bindPopup(popUpContent);

      marker.on('click', () => {
        this.showMarkerDetail(pin);
      });

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
