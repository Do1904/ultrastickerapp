import { Component, Input, inject } from '@angular/core';
import { Pin } from '../../../model/pin';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../../service/location.service';

@Component({
  selector: 'app-marker-detail-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marker-detail-panel.component.html',
  styleUrls: ['./marker-detail-panel.component.css', '../../../../sticker.css']
})
export class MarkerDetailPanelComponent {
  @Input() data: Pin | null = null;

  locationService: LocationService = inject(LocationService);

  public currentAddressObject: any;
  public currentAddress: string = '';

  public coodinate: { lat: number | null, lng: number | null } = {
    lat: null,
    lng: null
  };

  async ngOnChanges() {
    // データが変更されたときに実行される処理
    if (this.data) {
      this.coodinate.lat = this.data.latitude;
      this.coodinate.lng = this.data.longitude;

      // IDが新規作成用(-1)の場合は、現在の位置情報を取得して住所を変換
      if (this.data.id === -1) {
        this.currentAddressObject = await this.locationService.convertToAddress(this.data.latitude, this.data.longitude)
        this.currentAddress = this.currentAddressObject.addressOverview;
      }
    }
  }

  onImgError(event: any) {
    console.error('Image failed to load:', event.target.src);
  }
}
