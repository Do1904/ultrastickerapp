import { selectQuery, executeQuery } from "../db/queryUtils.js";
import { PinModel } from "../models/PinModel.js";
import { IStickerModel } from "../models/stickerModel.js";

async function getStickers() {
    const query = `
    SELECT 
        stickers.id as id,
        stickers.sticker as sticker,
        stickers.club as club,
        stickers.league as league,
        stickers.address as address,
        stickers.country as country,
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
        stickers.club as club,
        stickers.league as league,
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
        stickers.club as club,
        stickers.league as league,
        stickers.address as address,
        stickers.country as country,
        stickers.is_clean as isClean,
        stickers.user_id as userId,
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers WHERE id = ?`;

    return await selectQuery<IStickerModel>(query, [stickerId]);
}

async function getStickerLike(club: string) {
    const query = `
    SELECT
        stickers.id as id,
        stickers.sticker as sticker,
        stickers.club as club,
        stickers.league as league,
        stickers.address as address,
        stickers.country as country,
        stickers.is_clean as isClean,
        stickers.user_id as userId,
        ST_X(stickers.coordinate) AS longitude,
        ST_Y(stickers.coordinate) AS latitude
    FROM stickers WHERE club LIKE ?`;

    const clubWithWildcard = `%${club}%`;

    return await selectQuery<IStickerModel[]>(query, [clubWithWildcard]);
}

async function putNewSticker(userId: number, filePath: string, club: string, league: string, address: string, country: string) {
    const query = `
    INSERT INTO stickers (user_id, sticker, club, league, address, country, is_clean) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [userId, filePath, club, league, address, country, true];

    return await executeQuery(query, values);
}

async function updateStickerbyId(club: string, league: string, address: string, county: string, isClean: boolean, stickerId: number) {
    const query = `UPDATE stickers SET club = ?, league = ?, address = ?, country = ?, is_clean = ? WHERE id = ?`;
    const values = [club, league, address, county, isClean, stickerId];

    return await executeQuery(query, values);
}

async function deleteStickerbyId(stickerId: number, userId: number) {
    const query = `DELETE FROM stickers WHERE id = ? AND user_id = ?`;
    const values = [stickerId, userId];

    return await executeQuery(query, values);
}

export { getStickers, getStickersForMap, getStickerById, getStickerLike, putNewSticker, updateStickerbyId, deleteStickerbyId };