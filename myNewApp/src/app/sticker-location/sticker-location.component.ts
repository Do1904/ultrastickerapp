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

  async ngOnInit(): Promise<void> {
    this.stickerDetail.class = this.getRandomStickerClass();
  }

  onImgError(event: any) {
    console.error('Image failed to load:', event.target.src);
  }

  getRandomStickerClass(): string {
    const num = Math.floor(Math.random() * 5) + 2; // 1〜6
    return `sticker-${num}`;
  }
}

