import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickerDetail } from '../model/stickerdetail';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sticker-location',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: 'sticker-location.component.html',
  styleUrls: ['./sticker-location.component.css', '../../sticker.css'],
})
export class StickerLocationComponent {
  @Input() stickerDetail!: StickerDetail;

  onImgError(event: any) {
    console.error('Image failed to load:', event.target.src);
  }
}

