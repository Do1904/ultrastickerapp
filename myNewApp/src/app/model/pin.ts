export interface Pin {
    id: number;
    club: { clubName: string; clubId: number; color1: string; color2: string };
    league: { leagueName: string; leagueId: number };
    isClean: boolean;
    sticker: string;
    userId: number;
    longitude: number;
    latitude: number;
}