import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { LocationService } from '../../service/location.service';
import { MapService } from '../../service/map.service';
import { Pin } from '../../model/pin';
import { MarkerDetailPanelComponent } from './marker-detail-panel/marker-detail-panel.component';
import { SettingDetailPanelComponent } from './setting-detail-panel/setting-detail-panel.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MarkerDetailPanelComponent, SettingDetailPanelComponent, CommonModule],
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

  showPanel = false;

  locationService: LocationService = inject(LocationService);
  mapService: MapService = inject(MapService);

  private prefectureLayer: L.GeoJSON | null = null;
  public showPrefectures = true; // ← 初期状態：表示ON

  constructor(private http: HttpClient) { }

  async ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      const L = await import('leaflet'); // <-- ここをwindowガードの中に移す
      this.L = L;

      this.map = this.L.map('map', { zoomControl: false }).setView([35.681236, 139.767125], 13);
      this.L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">©OpenStreetMap</a> contributors, Tiles: <a href="http://map.hotosm.org/" target="_blank">©HOT</a>'
      }).addTo(this.map);

      new L.Control.Zoom({ position: 'bottomright' }).addTo(this.map);

      this.pins = await this.getPinsInit();
      if (this.pins && this.pins.length > 0) {
        await this.pinAll(this.pins);
      } else {
        console.warn('No pins found to display on the map.');
      }

      this.map.on('click', this.onMapClick.bind(this)); // 地図クリックイベントの設定

      this.loadPrefectureGeoJson();
    }
  }

  onMapClick(event: L.LeafletMouseEvent): void {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    const popupContent = `
      <div style="text-align: center;">
        <h4>Selected Location</h4>
        <p><a href="https://maps.google.com/maps?ll=${lat},${lng}&q=${lat},${lng}" target="_blank">Find this location on Google Map</a></p>
      </div>`; // ピンのポップアップ画面表示を設定

    const pin: Pin = {
      latitude: lat,
      longitude: lng,
      club: { clubId: 0, clubName: 'Unknown' }, // 仮のクラブ情報
      league: { leagueId: 0, leagueName: 'Unknown' }, // 仮のリーグ情報
      isClean: true,
      sticker: '',
      userId: 1, // 仮のユーザーID
      id: -1 // 仮のID
    };

    const marker = new this.L.marker([lat, lng]).addTo(this.map);

    marker.bindPopup(popupContent).openPopup();

    // this.moveToLocation(lat, lng); // 地図を移動

    this.showMarkerDetail(pin);
  }

  showMarkerDetail(pin: Pin) {
    this.selectedPin = pin;
    // ここで詳細画面component表示などの処理を行う
    this.showPanel = true;
  }

  async pinAll(pins: Pin[]): Promise<void> {
    pins.forEach((pin: Pin) => {
      const popupContent = `
      <div style="text-align: center;">
        <h2>${pin.club.clubName}</h2>
        <p>${pin.league.leagueName}</p>
        <p><a href="https://maps.google.com/maps?ll=${pin.latitude},${pin.longitude}&q=${pin.latitude},${pin.longitude}" target="_blank">Find this location on Google Map</a></p>
      </div>`; // ピンのポップアップ画面表示を設定
      this.addMarker(pin.latitude, pin.longitude, popupContent, pin);
    });
  }

  addMarker(lat: number, lng: number, popUpContent: string, pin: Pin): void {
    const customIcon = this.L.icon({
      iconUrl: 'assets/pins/pin-rotweiss.png', // ← ここに画像パス
      iconSize: [50, 50], // アイコンサイズ
      iconAnchor: [25, 50], // マーカーの「先端」がどこになるか（真ん中下）
      popupAnchor: [0, -25] // ポップアップの位置調整（上にずらす）
    });

    try {
      const marker = new this.L.marker([lat, lng], {
        icon: customIcon
      })
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

  getPinsInit = async (): Promise<Pin[]> => {
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

  private loadPrefectureGeoJson(): void {
    if (this.prefectureLayer) {
      this.prefectureLayer.remove(); // 重複防止
    }

    this.http.get<any>('assets/geos/japan.geojson').subscribe(geojson => {
      this.prefectureLayer = L.geoJSON(geojson, {
        style: (feature: any) => ({
          fillColor: this.getColor(feature),
          weight: 1,
          color: 'white',
          fillOpacity: 0.7
        }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(feature.properties.name);
        }
      });

      if (this.showPrefectures) {
        this.prefectureLayer.addTo(this.map);
      }
    });
  }


  public togglePrefectureLayer(): void {
    this.showPrefectures = !this.showPrefectures;
    console.info(this.prefectureLayer)

    console.info('Prefecture layer visibility:', this.showPrefectures);

    if (this.prefectureLayer) {
      if (this.showPrefectures) {
        console.info('Adding prefecture layer to map');
        this.prefectureLayer.addTo(this.map);
      } else {
        console.info('Removing prefecture layer from map');
        this.prefectureLayer.remove();
      }
    }
  }

  private getColor(feature: any): string {
    // console.info(feature)

    // const colors: { [key: string]: string } = {
    //   '東京都': '#f94144',
    //   '大阪府': '#f3722c',
    //   '北海道': '#f9c74f',
    //   '福岡県': '#90be6d'
    //   // 必要に応じて追加
    // };
    return '#577590'; // default color
  }

}
