export interface Pin {
    id: number;
    club: { clubName: string; clubId: number; color1: string; color2: string };
    league: { leagueName: string; leagueId: number };
    country: string;
    isClean: boolean;
    sticker: string;
    userId: number;
    longitude: number;
    latitude: number;
    createdAt?: string;
    postedBy?: string | null;
    comment?: string | null;
    addressText?: string;
}

export interface PinFilter {
    countryId?: number | null;
    leagueId?: number | null;
    clubId?: number | null;
}
