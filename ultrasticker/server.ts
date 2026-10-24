import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { initFirebaseAdmin } from './src/auth/firebaseAdmin.js';
import indexRouter from './src/routes/index.js';
import usersRouter from './src/routes/users.js';
import stickersRouter from './src/routes/stickers.js';
import putStickerRouter from './src/routes/putSticker.js';
import sendCheersRouter from './src/routes/cheers.js';
import commentsRouter from './src/routes/comments.js';
import mapRouter from './src/routes/map.js';
import statsRouter from './src/routes/stats.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 許可するオリジン。
 * Capacitorのネイティブアプリは capacitor://localhost (iOS) /
 * http://localhost (Android) から来るため、それらも明示的に許可する。
 * 本番のWebドメインは .env の ALLOWED_ORIGINS にカンマ区切りで追加する。
 */
const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:4200',   // Angular開発サーバー
    'http://localhost:8100',   // Capacitorのライブリロード
    'capacitor://localhost',   // iOSネイティブ
    'http://localhost',        // Androidネイティブ
];

const allowedOrigins = [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...(process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) ?? []),
];

app.use(cors({
    origin: (origin, callback) => {
        // サーバー間通信やcurlなどOriginヘッダーが無いリクエストは許可する
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 書き込み系APIのレート制限。
 * トークン検証は毎回Firebaseへ問い合わせる可能性があるため、
 * 総当たりや連投で費用・負荷が膨らむのを防ぐ。
 */
const writeLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' },
});

/**
 * 読み取り系APIのレート制限。
 * /stats と /maps は無認証で重い集計クエリを実行するため、連打でDBが詰まる。
 * 通常利用(地図の移動に伴う再取得など)を妨げない程度に緩く設定する。
 */
const readLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' },
});

app.use('/allStickers', indexRouter);
app.use('/users', usersRouter);
app.use('/stickers', stickersRouter);
app.use('/putStickers', writeLimiter, putStickerRouter);
app.use('/cheers', writeLimiter, sendCheersRouter);
app.use('/comments', writeLimiter, commentsRouter);
app.use('/maps', readLimiter, mapRouter);
app.use('/stats', readLimiter, statsRouter);

// CORS拒否など、ここまでで処理されなかったエラーの共通ハンドラ。
// 内部の詳細はクライアントへ返さない。
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    const status = err?.message?.startsWith('Origin not allowed') ? 403 : 500;
    res.status(status).json({ error: status === 403 ? 'Forbidden' : 'Internal server error' });
});

const port = Number(process.env.PORT ?? 3000);

// 起動時にFirebase Adminを初期化しておく。
// 環境変数が未設定なら、最初のログイン時ではなくこの時点で気づけるようにする。
try {
    initFirebaseAdmin();
    console.log('✅ Firebase Admin initialized');
} catch (error) {
    console.error('⚠️  Firebase Admin の初期化に失敗しました:', (error as Error).message);
    console.error('   認証が必要なAPIは動作しません。.env を確認してください。');
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
