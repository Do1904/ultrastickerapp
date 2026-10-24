import { selectQuery, executeQuery } from '../db/queryUtils.js';

/** パスワードハッシュは決して外部へ返さないため、明示的にカラムを列挙する */
const PUBLIC_USER_COLUMNS = `
    id,
    username,
    email,
    nickname,
    profile_picture AS profilePicture,
    role,
    auth_provider AS authProvider,
    last_login_at AS lastLoginAt,
    is_active AS isActive,
    created_at AS createdAt,
    updated_at AS updatedAt,
    favclub
`;

async function getUsers() {
    const query = `SELECT ${PUBLIC_USER_COLUMNS} FROM users`;

    return await selectQuery(query, []);
}

/**
 * 他人にも見える表示用プロフィール。
 * コメント欄の投稿者表示などに使うため、メールアドレスや権限情報は含めない。
 */
const DISPLAY_USER_COLUMNS = `
    id,
    username,
    nickname,
    profile_picture AS profilePicture,
    favclub
`;

async function getUserByIds(userIds: number[]) {
    if (userIds.length === 0) {
        return []; // 👈 空配列なら即返す
    }

    const placeholders = userIds.map(() => '?').join(',');
    const query = `
        SELECT ${DISPLAY_USER_COLUMNS}
        FROM users
        WHERE id IN (${placeholders});
    `;

    return await selectQuery(query, userIds);
}

/** Firebase UID から自前DBのユーザーを引く(認証ミドルウェアが毎リクエスト呼ぶ) */
async function getUserByFirebaseUid(firebaseUid: string) {
    const query = `
        SELECT ${PUBLIC_USER_COLUMNS}, firebase_uid AS firebaseUid
        FROM users
        WHERE firebase_uid = ?
        LIMIT 1;
    `;

    const rows = await selectQuery<any>(query, [firebaseUid]);
    return rows.length > 0 ? rows[0] : null;
}

/** メールアドレスで既存ユーザーを引く(Firebase移行前のアカウントとの突き合わせ用) */
async function getUserByEmail(email: string) {
    const query = `
        SELECT ${PUBLIC_USER_COLUMNS}, firebase_uid AS firebaseUid
        FROM users
        WHERE email = ?
        LIMIT 1;
    `;

    const rows = await selectQuery<any>(query, [email]);
    return rows.length > 0 ? rows[0] : null;
}

/**
 * 初回ログイン時に自前DBへユーザー行を作る(JITプロビジョニング)。
 * パスワードはFirebase側が保持するため、こちらでは常にNULLのままにする。
 */
async function createUserFromFirebase(params: {
    firebaseUid: string;
    email: string;
    username: string;
    nickname: string | null;
    profilePicture: string | null;
    authProvider: number;
}): Promise<number> {
    const query = `
        INSERT INTO users (
            firebase_uid,
            email,
            username,
            nickname,
            profile_picture,
            auth_provider,
            last_login_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    const result = await executeQuery(query, [
        params.firebaseUid,
        params.email,
        params.username,
        params.nickname,
        params.profilePicture,
        params.authProvider,
    ]);

    return result.insertId;
}

/** 既存アカウント(メール一致)にFirebase UIDを紐付ける */
async function linkFirebaseUid(userId: number, firebaseUid: string, authProvider: number) {
    const query = `
        UPDATE users
        SET firebase_uid = ?, auth_provider = ?, last_login_at = NOW()
        WHERE id = ?`;

    return await executeQuery(query, [firebaseUid, authProvider, userId]);
}

async function touchLastLogin(userId: number) {
    const query = `UPDATE users SET last_login_at = NOW() WHERE id = ?`;
    return await executeQuery(query, [userId]);
}

/** プロフィール更新(本人のみ。ニックネームと推しクラブ) */
async function updateProfile(userId: number, nickname: string | null, favclub: number | null) {
    const query = `UPDATE users SET nickname = ?, favclub = ? WHERE id = ?`;
    return await executeQuery(query, [nickname, favclub, userId]);
}

export {
    getUsers,
    getUserByIds,
    getUserByFirebaseUid,
    getUserByEmail,
    createUserFromFirebase,
    linkFirebaseUid,
    touchLastLogin,
    updateProfile,
};