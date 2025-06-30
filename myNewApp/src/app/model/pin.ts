export interface Pin {
    id: number;
    club: { clubName: string; clubId: number };
    league: { leagueName: string; leagueId: number };
    isClean: boolean;
    sticker: string;
    userId: number;
    longitude: number;
    latitude: number;
}