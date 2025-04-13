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

// 証明書と秘密鍵を読み込む
// const options = {
//     key: fs.readFileSync('certs/server.key'),
//     cert: fs.readFileSync('certs/server.crt'),
// };

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// HTTPSサーバーを作成
// https.createServer(options, app).listen(port, () => {
//     console.log(`HTTPS Server running on port ${port}`);
// });