import { selectQuery } from '../db/queryUtils.js';

async function getUsers() {
    const query = 'SELECT * FROM users';

    return await selectQuery(query, []);
}

export { getUsers };