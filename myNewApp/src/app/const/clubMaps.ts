import { COUNTRIES, LEAGUES, CLUBS } from './club';

export const countryMap = new Map<number, string>();
export const leagueMap = new Map<number, { leagueName: string; countryId: number }>();
export const clubMap = new Map<number, { clubName: string; leagueId: number }>();

// 初期化は一度だけ
(function initializeMaps() {
    for (const country of COUNTRIES) {
        countryMap.set(country.countryId, country.countryName);
    }

    for (const league of LEAGUES) {
        leagueMap.set(league.leagueId, {
            leagueName: league.leagueName,
            countryId: league.countryId,
        });
    }

    for (const club of CLUBS) {
        clubMap.set(club.clubId, {
            clubName: club.clubName,
            leagueId: club.leagueId,
        });
    }
})();
