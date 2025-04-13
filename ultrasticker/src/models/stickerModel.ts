import type { RowDataPacket } from 'mysql2/promise';

export interface IStickerModel extends RowDataPacket {
    id: number;
    club: string;
    league: string;
    address: string;
    country: string;
    sticker: string;
    isClean: boolean;
    userId: number;
}