import { LatLngLiteral, Point } from "leaflet";

export interface StickerDetail {
  id: number;
  club: string;
  league: string;
  address: string;
  country: string;
  sticker: string;
  isClean: boolean;
  userId: number;
  coordinate: LatLngLiteral;
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
  coordinate: LatLngLiteral;
  longitude?: number;
  latitude?: number;
}
