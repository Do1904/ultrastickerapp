import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.post('/postComment', async (req, res) => {
    const userId = 1; // 仮のユーザーID

    const { stickerId, comment, firstFlag, replyingCommentId } = req.body;

    if (!stickerId) {
        res.status(400).json({ error: 'Sticker ID is required.' });
        return;
    }

    try {
        await db.comments.postComment(comment, userId, stickerId, firstFlag, replyingCommentId);
        res.status(200).json({ message: 'Comment posted successfully' });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/comments/:stickerId', async (req, res) => {
    const stickerId = req.params.stickerId;

    if (!stickerId) {
        res.status(400).json({ error: 'Sticker ID is required.' });
        return;
    }

    try {
        const comments = await db.comments.getCommentsByStickerId(Number(stickerId));

        // このページで表示するユーザのIDを取得する
        const allVisiterIds: number[] = [];
        if (comments.length !== 0) {
            allVisiterIds.push(...new Set(comments.map(comment => comment.userId)));
        }

        const visiters = await db.users.getUserByIds(allVisiterIds);

        const resBody = {
            comments: comments,
            visiters: visiters,
        }

        res.status(200).json(resBody);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;