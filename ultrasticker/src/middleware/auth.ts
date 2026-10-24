import type { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../auth/firebaseAdmin.js';
import {
  getUserByFirebaseUid,
  getUserByEmail,
  createUserFromFirebase,
  linkFirebaseUid,
} from '../dao/users.js';

/** auth_provider カラムに入れる値 */
const AUTH_PROVIDER = {
  password: 1,
  'google.com': 2,
  'apple.com': 3,
} as const;

export interface AuthedUser {
  id: number;
  firebaseUid: string;
  email: string;
  username: string;
  nickname: string | null;
  role: number;
  isActive: boolean;
}

// Express の Request に user を生やす
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

function providerToCode(signInProvider: string | undefined): number {
  if (!signInProvider) return AUTH_PROVIDER.password;
  return (AUTH_PROVIDER as Record<string, number>)[signInProvider] ?? AUTH_PROVIDER.password;
}

/**
 * Firebase UID から自前DBのユーザーを解決する。
 * 初回ログインのユーザーはここで行を作る(JITプロビジョニング)。
 */
async function resolveLocalUser(decoded: {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  firebase?: { sign_in_provider?: string };
}): Promise<AuthedUser | null> {
  const firebaseUid = decoded.uid;
  const authProvider = providerToCode(decoded.firebase?.sign_in_provider);

  // 1. Firebase UID で引く(2回目以降のログインはここで終わる)
  let user = await getUserByFirebaseUid(firebaseUid);

  // 2. 見つからなければ、同じメールの既存アカウントに紐付ける
  if (!user && decoded.email) {
    const existing = await getUserByEmail(decoded.email);
    if (existing) {
      await linkFirebaseUid(existing.id, firebaseUid, authProvider);
      user = await getUserByFirebaseUid(firebaseUid);
    }
  }

  // 3. それでもなければ新規作成
  if (!user) {
    if (!decoded.email) return null; // メール無しのアカウントは受け付けない

    // username は一意制約があるため、UIDを混ぜて衝突を避ける
    const baseName = decoded.email.split('@')[0].slice(0, 20);
    const username = `${baseName}_${firebaseUid.slice(0, 6)}`;

    await createUserFromFirebase({
      firebaseUid,
      email: decoded.email,
      username,
      nickname: decoded.name?.slice(0, 20) ?? baseName.slice(0, 20),
      profilePicture: decoded.picture ?? null,
      authProvider,
    });

    user = await getUserByFirebaseUid(firebaseUid);
  }

  if (!user) return null;

  return {
    id: Number(user.id),
    firebaseUid,
    email: user.email,
    username: user.username,
    nickname: user.nickname ?? null,
    role: Number(user.role),
    isActive: !!user.isActive,
  };
}

/**
 * 認証必須のルートに付ける。
 * トークンが無い・無効・ユーザーが無効化されている場合は401を返す。
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'ログインが必要です' });
    return;
  }

  try {
    const decoded = await verifyIdToken(token);
    const user = await resolveLocalUser(decoded as any);

    if (!user) {
      res.status(401).json({ error: 'ユーザーを解決できませんでした' });
      return;
    }
    if (!user.isActive) {
      res.status(403).json({ error: 'このアカウントは無効化されています' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    // 検証失敗の詳細はクライアントに返さない(攻撃者へのヒントになるため)
    console.error('ID token verification failed:', error);
    res.status(401).json({ error: '認証に失敗しました' });
  }
}

/**
 * 認証は任意。ログインしていれば req.user が入るが、していなくても通す。
 * 「ログイン中なら自分のcheer済み状態を返す」といった用途に使う。
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    next();
    return;
  }

  try {
    const decoded = await verifyIdToken(token);
    const user = await resolveLocalUser(decoded as any);
    if (user?.isActive) req.user = user;
  } catch (error) {
    // 任意認証なので、失敗しても未ログイン扱いで続行する
    console.warn('optionalAuth: token ignored:', error);
  }

  next();
}
