import { Injectable, signal, computed } from '@angular/core';
import type { Auth, User as FirebaseUser } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from '../const/firebase';
import { API_BASE } from '../const/api';
import { registerTokenProvider } from './api-client';

/** 自前DB側のユーザー情報(バックエンドの /users/me が返す形) */
export interface AppUser {
  id: number;
  firebaseUid: string;
  email: string;
  username: string;
  nickname: string | null;
  role: number;
  isActive: boolean;
}

/** Capacitorネイティブ環境かどうか */
function isNativePlatform(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!(window as any).Capacitor?.isNativePlatform?.()
  );
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Firebase側のログイン状態 */
  private firebaseUser = signal<FirebaseUser | null>(null);
  /** 自前DB側のユーザー(アプリ内のuserIdはこちらを使う) */
  readonly appUser = signal<AppUser | null>(null);
  /** 認証状態の初期判定が終わったか(画面のちらつき防止に使う) */
  readonly ready = signal(false);

  readonly isLoggedIn = computed(() => this.appUser() !== null);
  readonly userId = computed(() => this.appUser()?.id ?? null);

  private auth: Auth | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // api-client が全APIコールにトークンを付けられるようにする
    registerTokenProvider(() => this.getIdToken());
  }

  /**
   * Firebase SDKを遅延初期化する。
   * SSR中(window未定義)は何もしない。SDKは初回ログイン時まで読み込まれないので、
   * 初期バンドルサイズにも影響しない。
   */
  private async ensureInit(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (this.auth) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      if (!isFirebaseConfigured) {
        console.warn(
          'Firebaseの設定が未入力です。src/app/const/firebase.ts を確認してください。'
        );
        this.ready.set(true);
        return;
      }

      const { initializeApp, getApps } = await import('firebase/app');
      const { getAuth, onAuthStateChanged, browserLocalPersistence, setPersistence } =
        await import('firebase/auth');

      const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
      this.auth = getAuth(app);

      // Webでは IndexedDB / localStorage に保存される。
      // ネイティブでは後述のCapacitorプラグインがKeychain/Keystoreを使う。
      if (!isNativePlatform()) {
        await setPersistence(this.auth, browserLocalPersistence);
      }

      // リロード後もログイン状態を復元する
      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(this.auth!, async (user: FirebaseUser | null) => {
          this.firebaseUser.set(user);
          if (user) {
            await this.syncWithBackend();
          } else {
            this.appUser.set(null);
          }
          this.ready.set(true);
          resolve();
          // 初回解決後も監視は継続する
          void unsubscribe;
        });
      });
    })();

    return this.initPromise;
  }

  /**
   * 現在のIDトークンを返す。
   * Firebase SDKが有効期限を見て自動更新するため、毎リクエスト呼んで問題ない。
   */
  async getIdToken(): Promise<string | null> {
    await this.ensureInit();
    const user = this.auth?.currentUser;
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Failed to get ID token:', error);
      return null;
    }
  }

  /** バックエンドの /users/me を叩き、自前DB側のユーザーIDを取得する */
  private async syncWithBackend(): Promise<void> {
    const token = await this.rawIdToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to sync user with backend:', response.status);
        this.appUser.set(null);
        return;
      }
      const data = await response.json();
      this.appUser.set(data.user as AppUser);
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      this.appUser.set(null);
    }
  }

  /** ensureInitを経由しないトークン取得(初期化中の再帰を避けるため内部用) */
  private async rawIdToken(): Promise<string | null> {
    const user = this.auth?.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }

  // ================= ログイン操作 =================

  async signUpWithEmail(email: string, password: string): Promise<void> {
    await this.ensureInit();
    const { createUserWithEmailAndPassword, sendEmailVerification } = await import(
      'firebase/auth'
    );
    const credential = await createUserWithEmailAndPassword(this.auth!, email, password);
    // 確認メールを送る(未確認でも使えるが、本人確認の導線として送っておく)
    await sendEmailVerification(credential.user);
    await this.syncWithBackend();
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    await this.ensureInit();
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(this.auth!, email, password);
    await this.syncWithBackend();
  }

  async signInWithGoogle(): Promise<void> {
    await this.ensureInit();

    if (isNativePlatform()) {
      // ネイティブでは公式Capacitorプラグインがネイティブのログイン画面を出す
      const { FirebaseAuthentication } = await import(
        '@capacitor-firebase/authentication'
      );
      const result = await FirebaseAuthentication.signInWithGoogle();
      const idToken = result.credential?.idToken;
      if (idToken) {
        const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
        await signInWithCredential(this.auth!, GoogleAuthProvider.credential(idToken));
      }
    } else {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(this.auth!, new GoogleAuthProvider());
    }

    await this.syncWithBackend();
  }

  async sendPasswordReset(email: string): Promise<void> {
    await this.ensureInit();
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(this.auth!, email);
  }

  async signOut(): Promise<void> {
    await this.ensureInit();

    if (isNativePlatform()) {
      const { FirebaseAuthentication } = await import(
        '@capacitor-firebase/authentication'
      );
      await FirebaseAuthentication.signOut();
    }

    const { signOut } = await import('firebase/auth');
    await signOut(this.auth!);
    this.appUser.set(null);
  }

  /** アプリ起動時に呼ぶ。ログイン状態の復元を待つ。 */
  async restore(): Promise<void> {
    await this.ensureInit();
  }

  /** Firebaseのエラーコードを日本語メッセージに変換する */
  translateError(error: any): string {
    const code = error?.code ?? '';
    const messages: Record<string, string> = {
      'auth/invalid-email': 'メールアドレスの形式が正しくありません',
      'auth/user-disabled': 'このアカウントは無効化されています',
      'auth/user-not-found': 'メールアドレスまたはパスワードが違います',
      'auth/wrong-password': 'メールアドレスまたはパスワードが違います',
      'auth/invalid-credential': 'メールアドレスまたはパスワードが違います',
      'auth/email-already-in-use': 'このメールアドレスは既に登録されています',
      'auth/weak-password': 'パスワードは6文字以上にしてください',
      'auth/too-many-requests':
        '試行回数が多すぎます。しばらく待ってから再試行してください',
      'auth/popup-closed-by-user': 'ログインがキャンセルされました',
      'auth/network-request-failed': 'ネットワークエラーが発生しました',
    };
    return messages[code] ?? 'エラーが発生しました。しばらくしてから再試行してください';
  }
}
