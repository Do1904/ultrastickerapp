import { selectQuery } from "../db/queryUtils.js";

export interface ClubStatRow {
  clubId: number;
  count: number;
  latestAt: string | null;
  latestSticker: string | null;
}

export interface RankingRow {
  clubId: number;
  count: number;
}

export interface PrefectureClubRow {
  state: string;
  clubId: number;
  count: number;
}

export interface HeatPointRow {
  latitude: number;
  longitude: number;
}

export interface TerritoryCellRow {
  latCell: number;
  lngCell: number;
  clubId: number;
  count: number;
}

export interface CityClubRow {
  city: string;
  state: string;
  clubId: number;
  count: number;
  latitude: number;
  longitude: number;
}

/** クラブ別統計: 投稿数・最新投稿日時・最新投稿写真 */
async function getClubStats(): Promise<ClubStatRow[]> {
  const query = `
    SELECT
        s.club_id as clubId,
        COUNT(*) as count,
        MAX(s.created_at) as latestAt,
        (
          SELECT s2.sticker FROM stickers s2
          WHERE s2.club_id = s.club_id
          ORDER BY s2.created_at DESC
          LIMIT 1
        ) as latestSticker
    FROM stickers s
    WHERE s.club_id IS NOT NULL
    GROUP BY s.club_id
    ORDER BY count DESC`;

  return await selectQuery<ClubStatRow>(query, []);
}

/** 表示中の地図範囲内のクラブ別投稿数ランキング */
async function getRankingInBounds(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
  limit: number = 20
): Promise<RankingRow[]> {
  const query = `
    SELECT
        s.club_id as clubId,
        COUNT(*) as count
    FROM stickers s
    WHERE s.club_id IS NOT NULL
      AND ST_Y(s.coordinate) BETWEEN ? AND ?
      AND ST_X(s.coordinate) BETWEEN ? AND ?
    GROUP BY s.club_id
    ORDER BY count DESC
    LIMIT ${Number(limit)}`;

  return await selectQuery<RankingRow>(query, [minLat, maxLat, minLng, maxLng]);
}

/** 都道府県 × クラブ別投稿数 */
async function getPrefectureClubCounts(): Promise<PrefectureClubRow[]> {
  const query = `
    SELECT
        a.state as state,
        s.club_id as clubId,
        COUNT(*) as count
    FROM stickers s
    INNER JOIN addresses a ON a.address_id = s.address_id
    WHERE a.state IS NOT NULL AND a.state <> '' AND s.club_id IS NOT NULL
    GROUP BY a.state, s.club_id
    ORDER BY a.state, count DESC`;

  return await selectQuery<PrefectureClubRow>(query, []);
}

/** ヒートマップ用の投稿座標一覧(クラブ指定は任意) */
async function getHeatPoints(clubId?: number): Promise<HeatPointRow[]> {
  const params: any[] = [];
  let where = "";
  if (clubId) {
    where = "WHERE s.club_id = ?";
    params.push(clubId);
  }

  const query = `
    SELECT
        ST_Y(s.coordinate) as latitude,
        ST_X(s.coordinate) as longitude
    FROM stickers s
    ${where}`;

  return await selectQuery<HeatPointRow>(query, params);
}

/** クラブ指定の都道府県別投稿密度(★表示用) */
async function getPrefectureDensityByClub(
  clubId: number
): Promise<{ state: string; count: number }[]> {
  const query = `
    SELECT
        a.state as state,
        COUNT(*) as count
    FROM stickers s
    INNER JOIN addresses a ON a.address_id = s.address_id
    WHERE s.club_id = ? AND a.state IS NOT NULL AND a.state <> ''
    GROUP BY a.state
    ORDER BY count DESC`;

  return await selectQuery<{ state: string; count: number }>(query, [clubId]);
}

/**
 * 勢力図用: 緯度経度メッシュ × クラブ別投稿数。
 * cellSize は度単位(例: 0.05 ≒ 約5km)。
 */
async function getTerritoryCells(cellSize: number): Promise<TerritoryCellRow[]> {
  const size = Number(cellSize);
  const query = `
    SELECT
        FLOOR(ST_Y(s.coordinate) / ${size}) as latCell,
        FLOOR(ST_X(s.coordinate) / ${size}) as lngCell,
        s.club_id as clubId,
        COUNT(*) as count
    FROM stickers s
    WHERE s.club_id IS NOT NULL
    GROUP BY latCell, lngCell, s.club_id`;

  return await selectQuery<TerritoryCellRow>(query, []);
}

/** 勢力図用: 市区町村 × クラブ別投稿数(代表座標は投稿の平均) */
async function getCityClubCounts(): Promise<CityClubRow[]> {
  const query = `
    SELECT
        a.city as city,
        a.state as state,
        s.club_id as clubId,
        COUNT(*) as count,
        AVG(ST_Y(s.coordinate)) as latitude,
        AVG(ST_X(s.coordinate)) as longitude
    FROM stickers s
    INNER JOIN addresses a ON a.address_id = s.address_id
    WHERE a.city IS NOT NULL AND a.city <> '' AND s.club_id IS NOT NULL
    GROUP BY a.city, a.state, s.club_id`;

  return await selectQuery<CityClubRow>(query, []);
}

export {
  getClubStats,
  getRankingInBounds,
  getPrefectureClubCounts,
  getHeatPoints,
  getPrefectureDensityByClub,
  getTerritoryCells,
  getCityClubCounts,
};
