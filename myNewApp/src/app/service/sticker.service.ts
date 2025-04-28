import { Injectable } from '@angular/core';
import { StickerDetail } from '../model/stickerdetail';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class StickerService {
  private dataUrl = 'http://localhost:3000/stickers';
  constructor(private http: HttpClient) { }

  getStickers = async () => {
    try {
      const response = await axios.get(this.dataUrl + '/stickers');
      return response.data;
    } catch (error) {
      console.error('Error fetching stickers:', error);
      throw error;
    }
  }

  getFilteredStickers(text: string): Observable<StickerDetail[]> {
    return this.http.get<StickerDetail[]>(`${this.dataUrl}/stickerLike/${text}`)
  }

  getStickerById = async (id: number) => {
    try {
      const response = await axios.get(`${this.dataUrl}/sticker/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error uploading sticker:', error);
      throw error;
    }
  }


}
