import type { RowDataPacket } from 'mysql2/promise';

export interface IAddressModel extends RowDataPacket {
    id: number;
    clubId: number;
    leagueId: number;
    addressId: number;
    countryId: number;
    sticker: string;
    isClean: boolean;
    userId: number;
    longitude?: number;
    latitude?: number;
}