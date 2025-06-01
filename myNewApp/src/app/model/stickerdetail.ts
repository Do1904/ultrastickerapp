
export interface StickerDetail {
  id: number;
  club: string;
  league: string;
  address: string;
  country: string;
  sticker: string;
  isClean: boolean;
  userId: number;
  class?: string;
  longitude?: number;
  latitude?: number;
}

export interface StickerDetailRequest {
  id: number;
  club: string;
  league: string;
  address: string;
  country: string;
  sticker: string;
  isClean: boolean;
  userId: number;
  longitude?: number;
  latitude?: number;
}
