import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import type * as Leaflet from 'leaflet';
import { LatLngLiteral } from 'leaflet';

import { PutstickerService } from '../../service/putsticker.service';
import { LocationService } from '../../service/location.service';
import { DraftService, StickerDraft } from '../../service/draft.service';
import { clubsOfLeague, leaguesOfCountry, selectableCountries } from '../../util/club-cascade';
import { Club, League } from '../../model/football';
import { AddressDetail } from '../../model/address';
import { extractGpsFromImage } from '../../util/exif-gps';
import { clubMap } from '../../const/clubMaps';

type LocationSource = 'none' | 'exif' | 'geolocation' | 'map';

interface DraftView {
  draft: StickerDraft;
  previewUrl: string;
}

@Component({
  selector: 'app-sticker-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: 'sticker-form.component.html',
  styleUrl: './sticker-form.component.css',
})
export class StickerFormComponent implements AfterViewInit, OnDestroy {
  putstickerService: PutstickerService = inject(PutstickerService);
  locationService: LocationService = inject(LocationService);
  draftService: DraftService = inject(DraftService);

  // ---- 写真 ----
  sticker: File | null = null;
  previewUrl: string | null = null;

  // ---- クラブ選択 ----
  public countries = selectableCountries();
  public filteredLeagues: League[] = [];
  public filteredClubs: Club[] = [];
  public selectedCountryId: number | null = null;
  public selectedLeagueId: number | null = null;
  public selectedClubId: number | null = null;

  // ---- 位置 ----
  public coordinate: LatLngLiteral | null = null;
  public locationSource: LocationSource = 'none';
  public currentAddress: AddressDetail & { addressOverview?: string } = {
    country: '',
    state: '',
    city: '',
    district: '',
    neighbourhood: '',
    postcode: '',
  };

  // ---- コメント ----
  public comment = '';

  // ---- 下書き / オフライン ----
  public drafts: DraftView[] = [];
  public online = true;
  private loadedDraftId: number | null = null;
  private onlineListener = () => (this.online = true);
  private offlineListener = () => (this.online = false);

  public submitting = false;

  private map: Leaflet.Map | null = null;
  private L: typeof Leaflet | null = null;
  private pickMarker: Leaflet.Marker | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;

    this.online = navigator.onLine;
    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);

    this.refreshDrafts();

    const L = await import('leaflet');
    this.L = L;

    // クエリパラメータ(地図クリックからの遷移)を初期位置に
    const params = this.route.snapshot.queryParams;
    const lat = Number(params['lat']);
    const lng = Number(params['lng']);
    const hasInitial = !Number.isNaN(lat) && !Number.isNaN(lng) && !(lat === 0 && lng === 0);

    const center: [number, number] = hasInitial ? [lat, lng] : [35.681236, 139.767125];

    this.map = L.map('pick-map', { zoomControl: true }).setView(center, hasInitial ? 16 : 11);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '©OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: Leaflet.LeafletMouseEvent) => {
      this.setCoordinate({ lat: e.latlng.lat, lng: e.latlng.lng }, 'map');
    });

    if (hasInitial) {
      await this.setCoordinate({ lat, lng }, 'map');
    }
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineListener);
      window.removeEventListener('offline', this.offlineListener);
    }
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.drafts.forEach((d) => URL.revokeObjectURL(d.previewUrl));
  }

  // ================= 写真 =================

  async fileChoosen(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.sticker = input.files[0];

    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(this.sticker);

    // ExifからGPS情報を取得(なければ地図で指定)
    const gps = await extractGpsFromImage(this.sticker);
    if (gps) {
      await this.setCoordinate({ lat: gps.lat, lng: gps.lng }, 'exif');
    } else if (this.locationSource === 'none' && this.online) {
      // カメラ直接撮影などExifが取れない場合は現在地を試みる
      this.getCurrentLocation().catch(() => undefined);
    }
  }

  // ================= 位置 =================

  private async setCoordinate(coordinate: LatLngLiteral, source: LocationSource): Promise<void> {
    this.coordinate = coordinate;
    this.locationSource = source;

    if (this.map && this.L) {
      if (this.pickMarker) {
        this.pickMarker.setLatLng(coordinate);
      } else {
        this.pickMarker = this.L.marker(coordinate, { draggable: true }).addTo(this.map);
        this.pickMarker.on('dragend', () => {
          const pos = this.pickMarker!.getLatLng();
          this.setCoordinate({ lat: pos.lat, lng: pos.lng }, 'map');
        });
      }
      this.map.setView(coordinate, Math.max(this.map.getZoom(), 15));
    }

    if (!this.online) return; // オフライン時は逆ジオコーディングをスキップ

    try {
      this.currentAddress = await this.locationService.convertToAddress(
        coordinate.lat,
        coordinate.lng
      );
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  }

  async getCurrentLocation(): Promise<void> {
    try {
      const coordinate = await this.locationService.getCurrentLocation();
      await this.setCoordinate(coordinate, 'geolocation');
    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('現在地を取得できませんでした。地図をクリックして位置を指定してください。');
    }
  }

  get locationSourceLabel(): string {
    switch (this.locationSource) {
      case 'exif': return '写真のGPS情報から取得';
      case 'geolocation': return '現在地から取得';
      case 'map': return '地図で指定';
      default: return '未設定(地図をクリックして指定できます)';
    }
  }

  // ================= クラブ選択 =================

  onCountryChange(): void {
    this.filteredLeagues = leaguesOfCountry(this.selectedCountryId);
    this.selectedLeagueId = null;
    this.selectedClubId = null;
    this.filteredClubs = [];
  }

  onLeagueChange(): void {
    this.filteredClubs = clubsOfLeague(this.selectedLeagueId);
    this.selectedClubId = null;
  }

  // ================= 下書き =================

  private async refreshDrafts(): Promise<void> {
    try {
      this.drafts.forEach((d) => URL.revokeObjectURL(d.previewUrl));
      const drafts = await this.draftService.listDrafts();
      this.drafts = drafts.map((draft) => ({
        draft,
        previewUrl: URL.createObjectURL(draft.photo),
      }));
    } catch {
      this.drafts = [];
    }
  }

  get canSaveDraft(): boolean {
    return !!this.sticker;
  }

  async saveAsDraft(showAlert: boolean = true): Promise<void> {
    if (!this.sticker) return;

    try {
      const id = await this.draftService.saveDraft({
        id: this.loadedDraftId ?? undefined,
        createdAt: new Date().toISOString(),
        photo: this.sticker,
        photoName: this.sticker.name,
        photoType: this.sticker.type,
        countryId: this.selectedCountryId,
        leagueId: this.selectedLeagueId,
        clubId: this.selectedClubId,
        lat: this.coordinate?.lat ?? null,
        lng: this.coordinate?.lng ?? null,
        comment: this.comment,
      });
      this.loadedDraftId = id;
      await this.refreshDrafts();
      if (showAlert) alert('下書きに保存しました。');
    } catch (error) {
      console.error('Failed to save draft:', error);
      if (showAlert) alert('下書きの保存に失敗しました。');
    }
  }

  async loadDraft(view: DraftView): Promise<void> {
    const draft = view.draft;

    this.sticker = new File([draft.photo], draft.photoName || 'draft.jpg', {
      type: draft.photoType || 'image/jpeg',
    });
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(this.sticker);

    this.selectedCountryId = draft.countryId;
    this.filteredLeagues = leaguesOfCountry(draft.countryId);
    this.selectedLeagueId = draft.leagueId;
    this.filteredClubs = clubsOfLeague(draft.leagueId);
    this.selectedClubId = draft.clubId;
    this.comment = draft.comment;
    this.loadedDraftId = draft.id ?? null;

    if (draft.lat !== null && draft.lng !== null) {
      await this.setCoordinate({ lat: draft.lat, lng: draft.lng }, 'map');
    }
  }

  async removeDraft(view: DraftView, event: Event): Promise<void> {
    event.stopPropagation();
    if (view.draft.id === undefined) return;
    await this.draftService.deleteDraft(view.draft.id);
    if (this.loadedDraftId === view.draft.id) this.loadedDraftId = null;
    await this.refreshDrafts();
  }

  draftClubName(draft: StickerDraft): string {
    if (!draft.clubId) return '(クラブ未選択)';
    return clubMap.get(draft.clubId)?.clubName ?? '(クラブ未選択)';
  }

  // ================= 送信 =================

  get canSubmit(): boolean {
    return (
      !!this.sticker &&
      !!this.selectedCountryId &&
      !!this.selectedLeagueId &&
      !!this.selectedClubId &&
      !!this.coordinate &&
      !this.submitting
    );
  }

  async onSubmit(): Promise<void> {
    if (!this.canSubmit || !this.sticker || !this.coordinate) return;

    // オフライン時は下書き保存に切り替え
    if (!this.online) {
      await this.saveAsDraft(false);
      alert('オフラインのため下書きに保存しました。オンラインになったら投稿してください。');
      return;
    }

    this.submitting = true;
    try {
      // 住所が未取得なら送信前に解決を試みる
      if (!this.currentAddress.state && !this.currentAddress.city) {
        try {
          this.currentAddress = await this.locationService.convertToAddress(
            this.coordinate.lat,
            this.coordinate.lng
          );
        } catch { /* 住所なしでも投稿は可能 */ }
      }

      await this.putstickerService.uploadImage(this.sticker, {
        sticker: {
          id: 0,
          clubId: this.selectedClubId!,
          leagueId: this.selectedLeagueId!,
          countryId: this.selectedCountryId!,
          isClean: true,
          sticker: 'sticker',
          userId: 1,
          coordinate: this.coordinate,
        },
        address: this.currentAddress,
        comment: this.comment.trim() || undefined,
      });

      // 投稿に成功したら対応する下書きを削除
      if (this.loadedDraftId !== null) {
        await this.draftService.deleteDraft(this.loadedDraftId);
        this.loadedDraftId = null;
      }

      alert('ステッカーを投稿しました!');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('There was an error!', error);
      alert('投稿に失敗しました。下書きに保存しておくこともできます。');
    } finally {
      this.submitting = false;
    }
  }
}
