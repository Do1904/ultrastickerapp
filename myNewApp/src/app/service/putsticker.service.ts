import { Injectable } from '@angular/core';
import { StickerUploadRequest } from '../model/stickerdetail';
import { apiPost } from './api-client';

@Injectable({
  providedIn: 'root',
})
export class PutstickerService {
  uploadImage(sticker: File, form: StickerUploadRequest): Promise<any> {
    const data = new FormData();
    data.append('sticker', sticker, sticker.name);
    data.append('clubId', String(form.sticker.clubId));
    data.append('leagueId', String(form.sticker.leagueId));
    data.append('countryId', String(form.sticker.countryId));
    data.append('isClean', 'true');
    data.append('userId', String(form.sticker.userId));
    data.append('longitude', String(form.sticker.coordinate.lng));
    data.append('latitude', String(form.sticker.coordinate.lat));
    data.append('country', form.address.country ?? '');
    data.append('state', form.address.state ?? '');
    data.append('city', form.address.city ?? '');
    data.append('district', form.address.district ?? '');
    data.append('neighbourhood', form.address.neighbourhood ?? '');
    data.append('postcode', form.address.postcode ?? '');
    if (form.comment) {
      data.append('comment', form.comment);
    }

    return apiPost('/putStickers/putNewSticker', data);
  }

  updateSticker(form: any): Promise<any> {
    return apiPost('/putStickers/editSticker', {
      id: form.id,
      clubId: form.clubId,
      leagueId: form.leagueId,
      addressId: form.addressId,
      countryId: form.countryId,
      isClean: true,
    });
  }

  deleteSticker(stickerId: number): Promise<any> {
    return apiPost('/putStickers/deleteSticker', {
      stickerId,
      userId: 1, // TODO: 認証実装後にログインユーザーIDへ置換
    });
  }
}
