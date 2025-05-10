
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
}
