import { selectQuery, executeQuery } from "../db/queryUtils.js";
import { PinModel } from "../models/PinModel.js";
import { IStickerModel } from "../models/stickerModel.js";

export interface MapPinFilter {
  countryId?: number;
  leagueId?: number;
  clubId?: number;
}

async function getStickers() {
  const query = `
    SELECT
        stickers.id as id,
        stickers.sticker as sticker,
        stickers.club_id as clubId,
        stickers.league_id as leagueId,
        stickers.address as address,
        stickers.country_id as countryId,
        stickers.is_clean as isClean,
        stickers.user_id as userId,
        stickers.created_at as createdAt,
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers`;

  return await selectQuery<IStickerModel[]>(query, []);
}

/**
 * 地図表示用ピン一覧。
 * マーカークリック時に必要な情報(写真/クラブ/リーグ/国/投稿日時/投稿者/コメント/住所)を
 * 1クエリで返す。国・リーグ・クラブでの絞り込みに対応。
 */
async function getStickersForMap(filter: MapPinFilter = {}) {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filter.clubId) {
    conditions.push("s.club_id = ?");
    params.push(filter.clubId);
  } else if (filter.leagueId) {
    conditions.push("s.league_id = ?");
    params.push(filter.leagueId);
  } else if (filter.countryId) {
    conditions.push("s.country_id = ?");
    params.push(filter.countryId);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT
        s.id as id,
        s.club_id as clubId,
        s.league_id as leagueId,
        s.country_id as countryId,
        s.is_clean as isClean,
        s.user_id as userId,
        s.sticker as sticker,
        s.created_at as createdAt,
        ST_X(s.coordinate) AS longitude,
        ST_Y(s.coordinate) AS latitude,
        COALESCE(u.nickname, u.username) as postedBy,
        a.state as state,
        a.city as city,
        a.district as district,
        a.neighbourhood as neighbourhood,
        (
          SELECT c.comment FROM comments c
          WHERE c.sticker_id = s.id
            AND c.user_id = s.user_id
            AND c.first_flag = 1
            AND c.status = 'active'
          ORDER BY c.created_at ASC
          LIMIT 1
        ) as comment
    FROM stickers s
    LEFT JOIN users u ON u.id = s.user_id
    LEFT JOIN addresses a ON a.address_id = s.address_id
    ${where}`;

  return await selectQuery<PinModel[]>(query, params);
}

async function getStickerById(stickerId: number) {
  const query = `
    SELECT
        stickers.id as id,
        stickers.sticker as sticker,
        stickers.club_id as clubId,
        stickers.league_id as leagueId,
        stickers.address_id as addressId,
        stickers.country_id as countryId,
        stickers.is_clean as isClean,
        stickers.user_id as userId,
        stickers.created_at as createdAt,
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers WHERE id = ?`;

  return await selectQuery<IStickerModel>(query, [stickerId]);
}

async function getStickerWithAddressById(stickerId: number) {
  const query = `
    SELECT
        stickers.id as id,
        stickers.sticker as sticker,
        stickers.club_id as clubId,
        stickers.league_id as leagueId,
        stickers.address_id as addressId,
        stickers.country_id as countryId,
        stickers.is_clean as isClean,
        stickers.user_id as userId,
        stickers.created_at as createdAt,
        addresses.country,
        addresses.state,
        addresses.city,
        addresses.district,
        addresses.neighbourhood,
        addresses.postcode,
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers
    INNER JOIN addresses ON stickers.address_id = addresses.address_id
    WHERE stickers.id = ?`;

  return await selectQuery<IStickerModel>(query, [stickerId]);
}

async function putNewSticker(
  userId: number,
  filePath: string,
  clubId: number,
  leagueId: number,
  addressId: number,
  countryId: number,
  longitude: number,
  latitude: number
): Promise<number> {
  const query = `
    INSERT INTO stickers (
      user_id,
      sticker,
      club_id,
      league_id,
      address_id,
      country_id,
      is_clean,
      coordinate
    ) VALUES
      (?, ?, ?, ?, ?, ?, ?, ST_GeomFromText(?))`;

  const values = [
    userId,
    filePath,
    clubId,
    leagueId,
    addressId,
    countryId,
    true,
    `POINT(${longitude} ${latitude})`,
  ];

  const result = await executeQuery(query, values);
  return result.insertId;
}

async function updateStickerbyId(
  clubId: number,
  leagueId: number,
  addressId: number,
  countryId: number,
  isClean: boolean,
  stickerId: number
) {
  const query = `UPDATE stickers SET club_id = ?, league_id = ?, address_id = ?, country_id = ?, is_clean = ? WHERE id = ?`;
  const values = [clubId, leagueId, addressId, countryId, isClean, stickerId];

  return await executeQuery(query, values);
}

async function deleteStickerbyId(stickerId: number, userId: number) {
  const query = `DELETE FROM stickers WHERE id = ? AND user_id = ?`;
  const values = [stickerId, userId];

  return await executeQuery(query, values);
}

export {
  getStickers,
  getStickersForMap,
  getStickerById,
  putNewSticker,
  updateStickerbyId,
  deleteStickerbyId,
  getStickerWithAddressById,
};
