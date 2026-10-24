import express from 'express';
import db from '../db/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/sendCheers', requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const stickerId = Number(req.body.id);

    if (!stickerId) {
        res.status(400).json({ error: 'Sticker ID is required.' });
        return;
    }

    const cheerStatus: number = await db.cheers.getCheersCountSentByLoginUserToThisSticker(stickerId, userId);

    if (cheerStatus > 0) {
        res.status(400).json({ error: 'You have already cheered for this sticker.' });
        return;
    }

    try {
        await db.cheers.sendCheers(userId, stickerId);
        res.status(200).json({ message: 'Cheers sent successfully' });
    } catch (error) {
        console.error('Error sending cheers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/deleteCheers', requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const stickerId = Number(req.body.id);

    if (!stickerId) {
        res.status(400).json({ error: 'Sticker ID is required.' });
        return;
    }

    const cheerStatus: number = await db.cheers.getCheersCountSentByLoginUserToThisSticker(stickerId, userId);

    if (cheerStatus === 0) {
        res.status(400).json({ error: 'You have not cheered for this sticker yet.' });
        return;
    }

    try {
        await db.cheers.deleteCheers(userId, stickerId);
        res.status(200).json({ message: 'Cheers deleted successfully' });
    } catch (error) {
        console.error('Error deleting cheers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 未ログインでも総数は見せる。自分がcheer済みかはログイン時のみ判定する。
router.get('/getCheers/:id', optionalAuth, async (req, res) => {
    const stickerId = Number(req.params.id);
    const userId = req.user?.id ?? null;

    try {
        const totalCheers = await db.cheers.getTotalCheersCountById(stickerId);

        if (totalCheers == null) {
            res.status(404).json({ error: 'Sticker not found' });
            return;
        }

        const isCheerSentByLoginUser =
            userId !== null && totalCheers.some((cheer) => cheer.userId === userId);

        res.json({
            isCheerSentByLoginUser,
            totalCheers: totalCheers.length,
        });
    }
    catch (error) {
        console.error('❌ Error fetching cheers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
