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

export default router;