import { Component, Input } from '@angular/core';
import { Pin } from '../../model/pin';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-marker-detail-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marker-detail-panel.component.html',
  styleUrls: ['./marker-detail-panel.component.css', '../../../sticker.css']
})
export class MarkerDetailPanelComponent {
  @Input() data: Pin | null = null;

  ngOnChanges() {
    if (this.data) {
      console.log('MarkerDetailPanelComponent data changed:', this.data);

    }
  }

  onImgError(event: any) {
    console.error('Image failed to load:', event.target.src);
  }
}
