import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import type * as Leaflet from 'leaflet';

import { LocationService, AddressSearchResult } from '../../service/location.service';
import { MapService } from '../../service/map.service';
import {
  StatsService,
  ClubStat,
  RankingEntry,
  PrefectureStat,
} from '../../service/stats.service';
import { Pin, PinFilter } from '../../model/pin';
import { MarkerDetailPanelComponent } from './marker-detail-panel/marker-detail-panel.component';
import { createColoredFlagSvg } from '../../const/flag';
import { createHeatLayer } from '../../util/heat-layer';
import { clubsOfLeague, leaguesOfCountry, selectableCountries } from '../../util/club-cascade';
import { clubMap, leagueMap, countryMap } from '../../const/clubMaps';
import { Club, League } from '../../model/football';

type LayerMode = 'markers' | 'heat' | 'territory';

/** 日本全体が収まる初期表示 */
const JAPAN_CENTER: [number, number] = [36.5, 137.0];
const JAPAN_ZOOM = 5;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MarkerDetailPanelComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map!: Leaflet.Map;
  private L!: typeof Leaflet;

  // ---- レイヤー ----
  private markerLayer: Leaflet.LayerGroup | null = null;
  private heatLayer: any = null;
  private territoryLayer: Leaflet.LayerGroup | null = null;
  private prefectureLayer: Leaflet.GeoJSON | null = null;
  private searchMarker: Leaflet.Marker | null = null;

  // ---- 状態 ----
  public pins: Pin[] = [];
  public selectedPin: Pin | null = null;
  public showPanel = false;

  public layerMode: LayerMode = 'markers';
  public showPrefectures = false;

  // ---- パネル開閉(モバイルでは初期折りたたみ) ----
  public leftPanelOpen = true;
  public rightPanelOpen = true;

  /** 狭い画面では左右パネルを同時に開かない(重なって地図が見えなくなるため) */
  private get isNarrowScreen(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 800;
  }

  openLeftPanel(): void {
    this.leftPanelOpen = true;
    if (this.isNarrowScreen) this.rightPanelOpen = false;
  }

  openRightPanel(): void {
    this.rightPanelOpen = true;
    if (this.isNarrowScreen) this.leftPanelOpen = false;
  }

  // ---- フィルター ----
  public countries = selectableCountries();
  public filteredLeagues: League[] = [];
  public filteredClubs: Club[] = [];
  public selectedCountryId: number | null = null;
  public selectedLeagueId: number | null = null;
  public selectedClubId: number | null = null;

  // ---- 検索 ----
  public searchQuery = '';
  public searchResults: AddressSearchResult[] = [];
  public searching = false;

  // ---- 統計 ----
  public ranking: RankingEntry[] = [];
  public clubStats: ClubStat[] = [];
  public prefectureStats: PrefectureStat[] = [];
  public rightTab: 'ranking' | 'clubs' | 'prefectures' = 'ranking';

  private rankingTimer: any = null;
  private geojsonCache: any = null;

  constructor(
    private http: HttpClient,
    private locationService: LocationService,
    private mapService: MapService,
    private statsService: StatsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;

    // 小さい画面では地図を広く使えるよう、パネルは折りたたんだ状態から始める
    if (window.innerWidth <= 800) {
      this.leftPanelOpen = false;
      this.rightPanelOpen = false;
    }

    const L = await import('leaflet');
    this.L = L;

    this.map = L.map('map', { zoomControl: false }).setView(JAPAN_CENTER, JAPAN_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">©OpenStreetMap</a> contributors, Tiles: <a href="http://map.hotosm.org/" target="_blank">©HOT</a>',
    }).addTo(this.map);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
    this.map.on('moveend', () => this.scheduleRankingUpdate());

    await this.reloadPins();
    this.scheduleRankingUpdate();
    this.loadStats();
  }

  ngOnDestroy(): void {
    if (this.rankingTimer) clearTimeout(this.rankingTimer);
    if (this.map) this.map.remove();
  }

  // ================= フィルター =================

  onCountryChange(): void {
    this.filteredLeagues = leaguesOfCountry(this.selectedCountryId);
    this.selectedLeagueId = null;
    this.selectedClubId = null;
    this.filteredClubs = [];
    this.applyFilters();
  }

  onLeagueChange(): void {
    this.filteredClubs = clubsOfLeague(this.selectedLeagueId);
    this.selectedClubId = null;
    this.applyFilters();
  }

  onClubChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCountryId = null;
    this.selectedLeagueId = null;
    this.selectedClubId = null;
    this.filteredLeagues = [];
    this.filteredClubs = [];
    this.applyFilters();
  }

  get currentFilter(): PinFilter {
    return {
      countryId: this.selectedCountryId,
      leagueId: this.selectedLeagueId,
      clubId: this.selectedClubId,
    };
  }

  async applyFilters(): Promise<void> {
    await this.reloadPins();
    if (this.layerMode === 'heat') {
      await this.renderHeatmap();
    }
  }

  // ================= ピン表示 =================

  private async reloadPins(): Promise<void> {
    try {
      this.pins = await this.mapService.getAllPins(this.currentFilter);
    } catch (error) {
      console.error('Error loading pins:', error);
      this.pins = [];
    }
    if (this.layerMode === 'markers') {
      this.renderMarkers();
    }
  }

  /** クラブごとにアイコンを使い回す(ピンごとのSVG再生成を避ける) */
  private iconCache = new Map<number, Leaflet.Icon>();

  private iconForClub(club: Pin['club']): Leaflet.Icon {
    const cached = this.iconCache.get(club.clubId);
    if (cached) return cached;

    const svg = createColoredFlagSvg(club.color1, club.color2);
    const icon = this.L.icon({
      iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      iconSize: [50, 50],
      iconAnchor: [25, 40],
      popupAnchor: [0, -25],
    });
    this.iconCache.set(club.clubId, icon);
    return icon;
  }

  private renderMarkers(): void {
    if (this.markerLayer) {
      this.markerLayer.remove();
    }
    this.markerLayer = this.L.layerGroup();

    for (const pin of this.pins) {
      const marker = this.L.marker([pin.latitude, pin.longitude], {
        icon: this.iconForClub(pin.club),
      });
      marker.on('click', () => this.showMarkerDetail(pin));
      this.markerLayer.addLayer(marker);
    }

    this.markerLayer.addTo(this.map);
  }

  showMarkerDetail(pin: Pin): void {
    this.selectedPin = pin;
    this.showPanel = true;
  }

  closeDetail(): void {
    this.showPanel = false;
    this.selectedPin = null;
  }

  onMapClick(event: Leaflet.LeafletMouseEvent): void {
    // 空き地クリック → 新規投稿導線
    const pin: Pin = {
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
      club: { clubId: 0, clubName: 'Unknown', color1: '#000000', color2: '#000000' },
      league: { leagueId: 0, leagueName: 'Unknown' },
      country: '',
      isClean: true,
      sticker: '',
      userId: 1,
      id: -1,
    };
    this.showMarkerDetail(pin);
  }

  // ================= 地域検索 =================

  async onSearch(): Promise<void> {
    if (!this.searchQuery.trim()) return;
    this.searching = true;
    try {
      this.searchResults = await this.locationService.searchAddress(this.searchQuery);
      if (this.searchResults.length === 1) {
        this.moveToSearchResult(this.searchResults[0]);
      }
    } catch (error) {
      console.error('Address search failed:', error);
      this.searchResults = [];
    } finally {
      this.searching = false;
    }
  }

  /** 現在地へ移動(モバイルでの街歩き用) */
  async locateMe(): Promise<void> {
    try {
      const location = await this.locationService.getCurrentLocation();
      this.map.flyTo([location.lat, location.lng], 15);

      if (this.searchMarker) this.searchMarker.remove();
      this.searchMarker = this.L.circleMarker([location.lat, location.lng], {
        radius: 8,
        color: '#1a73e8',
        fillColor: '#1a73e8',
        fillOpacity: 0.7,
      }).addTo(this.map) as any;
    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('現在地を取得できませんでした。位置情報の許可を確認してください。');
    }
  }

  moveToSearchResult(result: AddressSearchResult): void {
    this.map.flyTo([result.latitude, result.longitude], 14);

    if (this.searchMarker) this.searchMarker.remove();
    this.searchMarker = this.L.marker([result.latitude, result.longitude])
      .addTo(this.map)
      .bindPopup(result.displayName);

    this.searchResults = [];
  }

  // ================= レイヤー切替 =================

  async setLayerMode(mode: LayerMode): Promise<void> {
    this.layerMode = mode;

    // 一旦すべて外す
    if (this.markerLayer) this.markerLayer.remove();
    if (this.heatLayer) {
      this.heatLayer.remove();
      this.heatLayer = null;
    }
    if (this.territoryLayer) this.territoryLayer.remove();

    if (mode === 'markers') {
      this.renderMarkers();
    } else if (mode === 'heat') {
      await this.renderHeatmap();
    } else if (mode === 'territory') {
      await this.renderTerritory();
    }
  }

  private async renderHeatmap(): Promise<void> {
    try {
      const data = await this.statsService.getHeatmap(this.selectedClubId);
      const latlngs: [number, number][] = data.points.map((p) => [p.latitude, p.longitude]);

      if (this.heatLayer) this.heatLayer.remove();
      this.heatLayer = createHeatLayer(this.L, latlngs, { radius: 25, blur: 20 });
      this.heatLayer.addTo(this.map);
    } catch (error) {
      console.error('Error rendering heatmap:', error);
    }
  }

  private async renderTerritory(): Promise<void> {
    try {
      const data = await this.statsService.getTerritory(0.05);

      if (this.territoryLayer) this.territoryLayer.remove();
      this.territoryLayer = this.L.layerGroup();

      for (const cell of data.cells) {
        const club = clubMap.get(cell.clubId);
        const color = club?.color1 ?? '#888888';
        const name = club?.clubName ?? `Club ${cell.clubId}`;

        const rect = this.L.rectangle(
          [
            [cell.minLat, cell.minLng],
            [cell.maxLat, cell.maxLng],
          ],
          { color, weight: 1, fillColor: color, fillOpacity: 0.45 }
        );
        rect.bindTooltip(`${name} (${cell.count}/${cell.total}件)`, { sticky: true });
        this.territoryLayer.addLayer(rect);
      }

      this.territoryLayer.addTo(this.map);
    } catch (error) {
      console.error('Error rendering territory:', error);
    }
  }

  // ================= 都道府県勢力図 =================

  async togglePrefectureLayer(): Promise<void> {
    this.showPrefectures = !this.showPrefectures;

    if (!this.showPrefectures) {
      if (this.prefectureLayer) this.prefectureLayer.remove();
      return;
    }

    await this.renderPrefectureLayer();
  }

  private async renderPrefectureLayer(): Promise<void> {
    try {
      if (this.prefectureStats.length === 0) {
        this.prefectureStats = await this.statsService.getPrefectureStats();
      }
      if (!this.geojsonCache) {
        this.geojsonCache = await new Promise((resolve, reject) =>
          this.http
            .get<any>('assets/geos/japan.geojson')
            .subscribe({ next: resolve, error: reject })
        );
      }

      const statsByState = new Map(this.prefectureStats.map((s) => [s.state, s]));

      if (this.prefectureLayer) this.prefectureLayer.remove();

      this.prefectureLayer = this.L.geoJSON(this.geojsonCache, {
        style: (feature: any) => {
          const stat = statsByState.get(feature?.properties?.nam_ja);
          const topClub = stat?.clubs[0];
          const color = topClub
            ? clubMap.get(topClub.clubId)?.color1 ?? '#577590'
            : '#cccccc';
          return {
            fillColor: color,
            weight: 1,
            color: 'white',
            fillOpacity: stat ? 0.55 : 0.15,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const stateName = feature?.properties?.nam_ja;
          const stat = statsByState.get(stateName);
          if (!stat) {
            layer.bindPopup(`<b>${stateName}</b><br>投稿なし`);
            return;
          }
          const top3 = stat.clubs
            .slice(0, 3)
            .map((c, i) => `${i + 1}. ${this.clubName(c.clubId)} (${c.count}件)`)
            .join('<br>');
          layer.bindPopup(`<b>${stateName}</b> 全${stat.total}件<br>${top3}`);
        },
      });

      this.prefectureLayer.addTo(this.map);
    } catch (error) {
      console.error('Error rendering prefecture layer:', error);
    }
  }

  // ================= 統計・ランキング =================

  private scheduleRankingUpdate(): void {
    if (this.rankingTimer) clearTimeout(this.rankingTimer);
    this.rankingTimer = setTimeout(() => this.updateRanking(), 400);
  }

  private async updateRanking(): Promise<void> {
    if (!this.map) return;
    const bounds = this.map.getBounds();
    try {
      this.ranking = await this.statsService.getRanking({
        minLat: bounds.getSouth(),
        minLng: bounds.getWest(),
        maxLat: bounds.getNorth(),
        maxLng: bounds.getEast(),
      });
    } catch (error) {
      console.error('Error updating ranking:', error);
    }
  }

  private async loadStats(): Promise<void> {
    try {
      [this.clubStats, this.prefectureStats] = await Promise.all([
        this.statsService.getClubStats(),
        this.statsService.getPrefectureStats(),
      ]);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  /** クラブ統計から地図表示: そのクラブのピンにズーム */
  async focusClub(clubId: number): Promise<void> {
    this.selectedClubId = clubId;
    const club = clubMap.get(clubId);
    if (club) {
      const league = leagueMap.get(club.leagueId);
      this.selectedLeagueId = club.leagueId;
      this.selectedCountryId = league?.countryId ?? null;
      this.filteredLeagues = leaguesOfCountry(this.selectedCountryId);
      this.filteredClubs = clubsOfLeague(this.selectedLeagueId);
    }

    // マーカーモードに戻してフィルター適用
    if (this.layerMode !== 'markers') {
      await this.setLayerMode('markers');
    }
    await this.applyFilters();

    if (this.pins.length > 0) {
      const latlngs = this.pins.map((p) => [p.latitude, p.longitude] as [number, number]);
      this.map.fitBounds(this.L.latLngBounds(latlngs).pad(0.3));
    }
  }

  // ================= 表示ヘルパー =================

  clubName(clubId: number): string {
    return clubMap.get(clubId)?.clubName ?? `Club ${clubId}`;
  }

  clubColor(clubId: number): string {
    return clubMap.get(clubId)?.color1 ?? '#888888';
  }

  leagueNameOfClub(clubId: number): string {
    const club = clubMap.get(clubId);
    if (!club) return '';
    return leagueMap.get(club.leagueId)?.leagueName ?? '';
  }

  countryNameOfClub(clubId: number): string {
    const club = clubMap.get(clubId);
    if (!club) return '';
    const league = leagueMap.get(club.leagueId);
    if (!league) return '';
    return countryMap.get(league.countryId) ?? '';
  }

  stars(count: number, max: number): string {
    if (max <= 0) return '';
    const n = Math.max(1, Math.round((count / max) * 5));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  get maxPrefectureTotal(): number {
    return this.prefectureStats.length > 0 ? this.prefectureStats[0].total : 0;
  }
}
