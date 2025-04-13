import { Injectable } from '@angular/core';
import { StickerDetail } from '../model/stickerdetail';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PutstickerService {
  private uploadUrl = 'http://localhost:3000/putStickers/putNewSticker';
  private updateUrl = 'http://localhost:3000/putStickers/editSticker';
  private deleteUrl = 'http://localhost:3000/putStickers/deleteSticker';

  uploadImage = async (sticker: File, form: StickerDetail) => {
    try {
      const data = new FormData();
      data.append('sticker', sticker, sticker.name);
      data.append('club', form.club);
      data.append('league', form.league);
      data.append('address', form.address);
      data.append('country', form.country);
      data.append('isClean', 'true');
      data.append('userId', form.userId.toString());

      const response = await axios.post(this.uploadUrl, data);

      return response.data;
    } catch (error) {
      console.error('Error uploading sticker:', error);
      throw error;
    }
  }

  updateSticker = async (form: any) => {
    try {
      const data = new FormData();
      data.append('id', form.id);
      data.append('club', form.club);
      data.append('league', form.league);
      data.append('address', form.address);
      data.append('country', form.country);
      data.append('isClean', 'true');

      const response = await axios.post(this.updateUrl, data);

      return response.data;
    } catch (error) {
      console.error('Error uploading sticker:', error);
      throw error;
    }
  }

  deleteSticker = async (stickerId: number) => {
    const userId = 1;
    try {
      const body = {
        stickerId: stickerId,
        userId: userId
      }

      const response = await axios.post(this.deleteUrl, body);

      return response.data;
    } catch (error) {
      console.error('Error deleting sticker:', error);
      throw error;
    }
  }
}
