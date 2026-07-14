import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/allStickers', indexRouter);
app.use('/users', usersRouter);
app.use('/stickers', stickersRouter);
app.use('/putStickers', putStickerRouter);
app.use('/cheers', sendCheersRouter);
app.use('/comments', commentsRouter);
app.use('/maps', mapRouter);
app.use('/stats', statsRouter);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
