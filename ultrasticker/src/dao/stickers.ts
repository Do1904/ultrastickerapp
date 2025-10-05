import { selectQuery, executeQuery } from "../db/queryUtils.js";
import { PinModel } from "../models/PinModel.js";
import { IStickerModel } from "../models/stickerModel.js";

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
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers`;

  return await selectQuery<IStickerModel[]>(query, []);
}

async function getStickersForMap() {
  const query = `
    SELECT 
        stickers.id as id,
        stickers.club_id as clubId,
        stickers.league_id as leagueId,
        stickers.is_clean as isClean,
        stickers.user_id as userId,
        stickers.sticker as sticker,
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers`;

  return await selectQuery<PinModel[]>(query, []);
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
    WHERE id = ?`;

  return await selectQuery<IStickerModel>(query, [stickerId]);
}

async function getStickerLike(club: string) {
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
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers WHERE club LIKE ?`;

  const clubWithWildcard = `%${club}%`;

  return await selectQuery<IStickerModel[]>(query, [clubWithWildcard]);
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
) {
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

  return await executeQuery(query, values);
}

async function updateStickerbyId(
  club: string,
  league: string,
  address: string,
  county: string,
  isClean: boolean,
  stickerId: number
) {
  const query = `UPDATE stickers SET club_id = ?, league_id = ?, address = ?, country_id = ?, is_clean = ? WHERE id = ?`;
  const values = [club, league, address, county, isClean, stickerId];

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
  getStickerLike,
  putNewSticker,
  updateStickerbyId,
  deleteStickerbyId,
  getStickerWithAddressById,
};
