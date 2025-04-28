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

    const comments = await db.comments.getCommentsByStickerId(stickerId);

    // このページで表示するユーザのIDを取得する
    const allVisiterIds: number[] = [];
    if (comments.length !== 0) {
        allVisiterIds.push(...new Set(comments.map(comment => comment.userId)));
    }

    const visiters = await db.users.getUserByIds(allVisiterIds);

    const resBody = {
        sticker: sticker[0],
        comments: comments,
        visiters: visiters,
    }

    res.json(resBody);
});

router.get('/stickerLike/:test', async (req, res) => {
    const club = req.params.test;
    const sticker = await db.stickers.getStickerLike(club);

    res.json(sticker);
});

export default router;
