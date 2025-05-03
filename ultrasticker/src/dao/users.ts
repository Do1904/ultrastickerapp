import { selectQuery } from '../db/queryUtils.js';

async function getUsers() {
    const query = 'SELECT * FROM users';

    return await selectQuery(query, []);
}

async function getUserByIds(userIds: number[]) {
    const placeholders = userIds.map(() => '?').join(',');
    const query = `
        SELECT
            id,
            username,
            email,
            password,
            nickname,
            profile_picture AS profilePicture,
            role,
            auth_provider AS authProvider,
            last_login_at AS lastLoginAt,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt,
            favclub
        FROM
            users 
        WHERE id IN (${placeholders});
    `;

    return await selectQuery(query, userIds);
}

export { getUsers, getUserByIds };