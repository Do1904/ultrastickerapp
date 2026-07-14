import { Injectable } from '@angular/core';
import { apiGet } from './api-client';

@Injectable({
  providedIn: 'root'
})
export class StickerService {
  getStickers(): Promise<any> {
    return apiGet('/stickers/stickers');
  }

  getStickerById(id: number): Promise<any> {
    return apiGet(`/stickers/sticker/${id}`);
  }
}
