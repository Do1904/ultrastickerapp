import express from 'express';
import { getUserByIds, updateProfile, touchLastLogin } from '../dao/users.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * ログイン中のユーザー自身の情報。
 * フロントはログイン直後にこれを叩き、自前DB側のユーザーIDを受け取る。
 * (初回ログイン時のユーザー行作成はミドルウェア側で済んでいる)
 */
router.get('/me', requireAuth, async (req, res) => {
    await touchLastLogin(req.user!.id);
    res.json({ user: req.user });
});

/** プロフィール更新(本人のみ) */
router.post('/me', requireAuth, async (req, res) => {
    const { nickname, favclub } = req.body ?? {};

    if (nickname !== null && nickname !== undefined && typeof nickname !== 'string') {
        res.status(400).json({ error: 'nicknameの形式が不正です' });
        return;
    }
    if (typeof nickname === 'string' && nickname.length > 20) {
        res.status(400).json({ error: 'nicknameは20文字以内にしてください' });
        return;
    }

    await updateProfile(
        req.user!.id,
        nickname ?? null,
        favclub === undefined || favclub === null ? null : Number(favclub)
    );

    res.json({ success: true });
});

/**
 * 表示用の公開プロフィールをまとめて取得する。
 * 全ユーザー一覧のダンプは個人情報の観点で提供しない。
 */
router.post('/profiles', async (req, res) => {
    const ids = Array.isArray(req.body?.userIds) ? req.body.userIds.map(Number) : [];
    const users = await getUserByIds(ids.filter((id: number) => Number.isFinite(id)));
    res.json({ users });
});

export default router;
