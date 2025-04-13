import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.post('/sendCheers', async (req, res) => {
    const userId = 1; // 仮のユーザーID
    const stickerId = req.body.id; // `id` を明示的に取得

    const cheerStatus: number = await db.cheers.getCheersCountSentByLoginUserToThisSticker(stickerId, userId);

    if (!stickerId) {
        res.status(400).json({ error: 'Sticker ID is required.' });
        return;
    }
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

router.post('/deleteCheers', async (req, res) => {
    const userId = 1; // 仮のユーザーID
    const stickerId = req.body.id; // `id` を明示的に取得

    const cheerStatus: number = await db.cheers.getCheersCountSentByLoginUserToThisSticker(stickerId, userId);

    if (!stickerId) {
        res.status(400).json({ error: 'Sticker ID is required.' });
        return;
    }
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

router.get('/getCheers/:id', async (req, res) => {
    const stickerId = Number(req.params.id);

    const userId = 1; // 仮のユーザーID

    try {
        const totalCheers = await db.cheers.getTotalCheersCountById(stickerId);

        if (totalCheers == null) {
            res.status(404).json({ error: 'Sticker not found' });
            return;
        }

        // ログインユーザがこのステッカーに対してCheerを送ったかどうかを確認
        const isCheerSentByLoginUser = totalCheers.some((cheer) => cheer.userId === userId);

        const resBody = {
            isCheerSentByLoginUser: isCheerSentByLoginUser,
            totalCheers: totalCheers.length,
        };
        res.json(resBody);
    }
    catch (error) {
        console.error('❌ Error fetching cheers:', error);
    }
});

export default router;