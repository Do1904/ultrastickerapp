import { Component, OnInit, inject } from '@angular/core';
import { StickerLocationComponent } from '../sticker-location/sticker-location.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StickerDetail } from '../../model/stickerdetail';
import { StickerService } from '../../service/sticker.service';
import { clubMap } from '../../const/clubMaps';

@Component({
  selector: 'app-sticker',
  standalone: true,
  imports: [CommonModule, FormsModule, StickerLocationComponent],
  templateUrl: 'sticker.component.html',
  styleUrl: './sticker.component.css'
})
export class StickerComponent implements OnInit {
  stickerDetailList: StickerDetail[] = [];
  filteredList: StickerDetail[] = [];
  filterText = '';

  stickerService: StickerService = inject(StickerService);

  async ngOnInit(): Promise<void> {
    const stickers = await this.getStickersInit();
    // 新しい投稿を先頭に
    this.stickerDetailList = [...stickers].sort(
      (a: StickerDetail, b: StickerDetail) => b.id - a.id
    );
    this.filteredList = this.stickerDetailList;
  }

  filterResults(): void {
    const text = this.filterText.trim().toLowerCase();
    if (!text) {
      this.filteredList = this.stickerDetailList;
      return;
    }

    // クラブ名でクライアントサイドフィルタリング
    this.filteredList = this.stickerDetailList.filter((sticker) => {
      const clubName = clubMap.get(sticker.clubId)?.clubName ?? '';
      return clubName.toLowerCase().includes(text);
    });
  }

  clearFilter(): void {
    this.filterText = '';
    this.filterResults();
  }

  getStickersInit = async () => {
    try {
      return await this.stickerService.getStickers();
    } catch (error) {
      console.error('Error fetching stickers:', error);
      return [];
    }
  }
}
