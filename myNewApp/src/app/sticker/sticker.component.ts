import { Component, OnInit, inject } from '@angular/core';
import { StickerLocationComponent } from '../sticker-location/sticker-location.component';
import { CommonModule } from '@angular/common';
import { StickerDetail } from '../model/stickerdetail';
import { StickerService } from '../service/sticker.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-sticker',
  standalone: true,
  imports: [CommonModule,
    StickerLocationComponent,
    MatInputModule,
    MatButtonModule],
  templateUrl: 'sticker.component.html',
  styleUrl: './sticker.component.css'
})
export class StickerComponent implements OnInit {
  stickerDetailList: StickerDetail[] = [];
  stickerService: StickerService = inject(StickerService);
  filteredList: StickerDetail[] = [];

  constructor() { }

  async ngOnInit(): Promise<void> {
    this.stickerDetailList = await this.getStickersInit();
    this.filteredList = this.stickerDetailList;
    console.info(this.stickerDetailList);
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredList = this.stickerDetailList;
    }

    this.stickerService.getFilteredStickers(text).subscribe(data => {
      this.stickerDetailList = data;
      this.filteredList = this.stickerDetailList;
    }, (error) => {
      console.error('There was an error retrieving data:', error);
    });
  }

  getStickersInit = async () => {
    try {
      const response = await this.stickerService.getStickers();

      return response;
    } catch (error) {
      console.error('Error uploading sticker:', error);
      throw error;
    }
  }
}
