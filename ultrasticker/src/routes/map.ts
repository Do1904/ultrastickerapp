import express from 'express';
import db from '../db/index.js';

const router = express.Router();

/**
 * 地図用ピン一覧。
 * /maps/getAllPins?countryId=..&leagueId=..&clubId=..
 * (国・リーグ・クラブで絞り込み可能)
 */
router.get('/getAllPins', async (req, res) => {
    const filter = {
        countryId: req.query['countryId'] ? Number(req.query['countryId']) : undefined,
        leagueId: req.query['leagueId'] ? Number(req.query['leagueId']) : undefined,
        clubId: req.query['clubId'] ? Number(req.query['clubId']) : undefined,
    };

    try {
        const stickers = await db.stickers.getStickersForMap(filter);
        res.json(stickers);
    } catch (error) {
        console.error('Error fetching pins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
