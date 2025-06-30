import { LatLngLiteral, Point } from "leaflet";

export interface StickerDetail {
  id: number;
  clubId: number;
  leagueId: number;
  address: string;
  countryId: number;
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
  clubId: number;
  leagueId: number;
  address: string;
  countryId: number;
  sticker: string;
  isClean: boolean;
  userId: number;
  coordinate: LatLngLiteral;
  longitude?: number;
  latitude?: number;
}
