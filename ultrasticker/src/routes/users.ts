import express from 'express';
import { getUsers } from '../dao/users.js';

const router = express.Router();

router.get('/users', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

export default router;
