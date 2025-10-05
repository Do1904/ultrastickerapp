import { Injectable } from '@angular/core';
import { StickerUploadRequest } from '../model/stickerdetail';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PutstickerService {
  private uploadUrl = 'http://localhost:3000/putStickers/putNewSticker';
  private updateUrl = 'http://localhost:3000/putStickers/editSticker';
  private deleteUrl = 'http://localhost:3000/putStickers/deleteSticker';

  uploadImage = async (sticker: File, form: StickerUploadRequest) => {
    try {
      const data = new FormData();
      data.append('sticker', sticker, sticker.name);
      data.append('clubId', form.sticker.clubId.toString());
      data.append('leagueId', form.sticker.leagueId.toString());
      data.append('countryId', form.sticker.countryId.toString());
      data.append('isClean', 'true');
      data.append('userId', form.sticker.userId.toString());
      data.append('longitude', JSON.stringify(form.sticker.coordinate.lng));
      data.append('latitude', JSON.stringify(form.sticker.coordinate.lat));
      data.append(
        'country',
        form.address.country ? form.address.country.toString() : ''
      );
      data.append(
        'state',
        form.address.state ? form.address.state.toString() : ''
      );
      data.append(
        'city',
        form.address.city ? form.address.city.toString() : ''
      );
      data.append(
        'district',
        form.address.district ? form.address.district.toString() : ''
      );
      data.append(
        'neighbourhood',
        form.address.neighbourhood ? form.address.neighbourhood.toString() : ''
      );
      data.append(
        'postcode',
        form.address.postcode ? form.address.postcode.toString() : ''
      );

      const response = await axios.post(this.uploadUrl, data);

      return response.data;
    } catch (error) {
      console.error('Error uploading sticker:', error);
      throw error;
    }
  };

  updateSticker = async (form: any) => {
    try {
      const data = new FormData();
      data.append('id', form.id);
      data.append('clubId', form.clubId);
      data.append('leagueId', form.leagueId);
      data.append('addressId', form.addressId);
      data.append('countryId', form.countryId);
      data.append('isClean', 'true');

      const response = await axios.post(this.updateUrl, data);

      return response.data;
    } catch (error) {
      console.error('Error uploading sticker:', error);
      throw error;
    }
  };

  deleteSticker = async (stickerId: number) => {
    const userId = 1;
    try {
      const body = {
        stickerId: stickerId,
        userId: userId,
      };

      const response = await axios.post(this.deleteUrl, body);

      return response.data;
    } catch (error) {
      console.error('Error deleting sticker:', error);
      throw error;
    }
  };
}
