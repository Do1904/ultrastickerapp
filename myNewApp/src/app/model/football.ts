export interface Football {
    countryId: number;
    countryName: string;
    leagues: { leagueId: number, leagueName: string, clubs: { clubId: number, clubName: string }[] }[];
}

export interface Country {
    countryId: number;
    countryName: string;
}

export interface League {
    leagueId: number;
    leagueName: string;
    countryId: number;
}

export interface Club {
    clubId: number;
    clubName: string;
    leagueId: number;
    color1: string;
    color2: string;
}