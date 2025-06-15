import express from 'express';
import db from '../db/index.js';
import { PinModel } from '../models/PinModel.js';

const router = express.Router();

router.get('/getAllPins', async (req, res) => {
    const stickers = await db.stickers.getStickersForMap();

    res.json(stickers);
});

export default router;