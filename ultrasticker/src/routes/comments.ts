import express from 'express';
import db from '../db/index.js';
import { ICommentModel } from '../models/commentModel.js';

const router = express.Router();

router.post('/postComment', async (req, res) => {
    const userId = 1; // 仮のユーザーID

    const { stickerId, comment, firstFlag, replyingCommentId } = req.body;

    if (!stickerId) {
        res.status(400).json({ error: 'Sticker ID is required.' });
        return;
    }

    try {
        const insertResult = await db.comments.postComment(comment, userId, stickerId, firstFlag, replyingCommentId);
        const insertedComment = await db.comments.getCommentById(insertResult.insertId);
        if (!insertedComment) {
            res.status(404).json({ error: 'Comment not found.' });
            return;
        } else {
            if (firstFlag) {
                insertedComment.replies = [] as ICommentModel[];
            }
            res.status(200).json({ insertedComment: insertedComment });
        }
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

        const firstComments = comments.filter(comment => comment.firstFlag).map(comment => ({
            ...comment,
            replies: [] as ICommentModel[],
        }));

        // firstFlagがfalseのコメントを取得
        const replyingComments = comments.filter(comment => !comment.firstFlag);

        // replyingCommentIdを基にrepliesに追加
        replyingComments.forEach(reply => {
            const parentComment = firstComments.find(
                firstComment => firstComment.id === reply.replyingCommentId
            );
            if (parentComment) {
                parentComment.replies.push(reply); // repliesにコメントIDを追加
            }
        });

        const resBody = {
            comments: firstComments,
            visiters: visiters,
        }

        res.status(200).json(resBody);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/deleteComment', async (req, res) => {
    const { commentId } = req.body;

    if (!commentId) {
        res.status(400).json({ error: 'Comment ID is required.' });
        return;
    }

    try {
        await db.comments.deleteCommentById(commentId);
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;