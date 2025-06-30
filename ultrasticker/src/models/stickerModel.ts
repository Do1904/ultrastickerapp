import type { RowDataPacket } from 'mysql2/promise';

export interface IStickerModel extends RowDataPacket {
    id: number;
    clubId: number;
    leagueId: number;
    address: string;
    countryId: number;
    sticker: string;
    isClean: boolean;
    userId: number;
    longitude?: number;
    latitude?: number;
}