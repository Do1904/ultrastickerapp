import { countQuery, executeQuery, selectQuery } from '../db/queryUtils.js';

async function sendCheers(userId: number, stickerId: number) {
    const query = `INSERT INTO cheers (user_id, sticker_id) VALUES (?, ?);`;
    const values = [userId, stickerId];

    return await executeQuery(query, values);
}

async function deleteCheers(userId: number, stickerId: number) {
    const query = `DELETE FROM cheers WHERE user_id = ? AND sticker_id = ?;`;
    const values = [userId, stickerId];

    return await executeQuery(query, values);
}

async function getCheersCountSentByLoginUserToThisSticker(stickerId: number, userId: number): Promise<number> {
    const query = `SELECT count(*) AS count FROM cheers WHERE sticker_id = ? AND user_id = ?;`;
    const values = [stickerId, userId];

    return await countQuery(query, values);
}

async function getTotalCheersCountById(stickerId: number): Promise<any[]> {
    const query = `
    SELECT 
        user_id AS userId
    FROM 
        cheers 
    WHERE
        sticker_id = ?;
    `;

    const values = [stickerId];

    return await selectQuery(query, values);
}

export { sendCheers, getCheersCountSentByLoginUserToThisSticker, deleteCheers, getTotalCheersCountById };