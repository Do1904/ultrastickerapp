import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.get('/stickers', async (req, res) => {
    const stickers = await db.stickers.getStickers();

    res.json(stickers);
});

router.get('/sticker/:id', async (req, res) => {
    const stickerId = Number(req.params.id);

    const sticker = await db.stickers.getStickerById(stickerId);

    if (sticker.length === 0) {
        res.status(404).send('ステッカーが見つかりません');
        return;
    }
    res.json(sticker[0]);
});

router.get('/stickerLike/:test', async (req, res) => {
    const club = req.params.test;
    const sticker = await db.stickers.getStickerLike(club);

    res.json(sticker);
});

export default router;
