import { Component, Input, inject } from '@angular/core';
import { Pin } from '../../model/pin';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../service/location.service';

@Component({
  selector: 'app-marker-detail-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marker-detail-panel.component.html',
  styleUrls: ['./marker-detail-panel.component.css', '../../../sticker.css']
})
export class MarkerDetailPanelComponent {
  @Input() data: Pin | null = null;

  locationService: LocationService = inject(LocationService);

  public currentAddress: string = '';

  async ngOnChanges() {
    if (this.data) {
      console.log('MarkerDetailPanelComponent data changed:', this.data);

      if (this.data.id === -1) {
        this.currentAddress = await this.locationService.convertToAddress(this.data.latitude, this.data.longitude)
        console.info('Converted address:', this.currentAddress);
      }
    }
  }

  onImgError(event: any) {
    console.error('Image failed to load:', event.target.src);
  }
}
