import { CLUBS, COUNTRIES, LEAGUES } from '../const/club';
import { Club, Country, League } from '../model/football';

/**
 * 国 → リーグ → クラブ のカスケード選択ロジック(共有)。
 * map.component と sticker-form.component で同じ絞り込みを行うため一元化。
 */

/** テスト用データ(countryId=99)を除いた選択可能な国一覧 */
export function selectableCountries(): Country[] {
  return COUNTRIES.filter((c) => c.countryId !== 99);
}

export function leaguesOfCountry(countryId: number | null): League[] {
  return countryId ? LEAGUES.filter((l) => l.countryId === countryId) : [];
}

export function clubsOfLeague(leagueId: number | null): Club[] {
  return leagueId ? CLUBS.filter((c) => c.leagueId === leagueId) : [];
}
