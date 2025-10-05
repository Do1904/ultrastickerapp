import { LatLngLiteral, Point } from "leaflet";
import { AddressDetail } from "./address";

export interface StickerDetail {
  id: number;
  clubId: number;
  leagueId: number;
  countryId: number;
  sticker: string;
  isClean: boolean;
  userId: number;
  coordinate: LatLngLiteral;
  class?: string;
  longitude?: number;
  latitude?: number;
}

export interface StickerUploadRequest {
  sticker: StickerDetail;
  address: AddressDetail;
}
