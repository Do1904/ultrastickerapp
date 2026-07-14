export interface PinModel {
    id: number;
    clubId: number;
    leagueId: number;
    countryId: number;
    isClean: boolean;
    sticker: string;
    userId: number;
    longitude: number;
    latitude: number;
    createdAt?: string;
    postedBy?: string | null;
    state?: string | null;
    city?: string | null;
    district?: string | null;
    neighbourhood?: string | null;
    comment?: string | null;
}
