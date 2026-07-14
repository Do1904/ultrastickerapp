/**
 * バックエンドAPIのベースURL(全サービス共通)。
 *
 * Capacitorネイティブアプリ(iOS/Android実機)では localhost は端末自身を指すため、
 * 開発マシンのLAN IPを指定する必要がある。
 * 例: Macで `ipconfig getifaddr en0` を実行して得たIPに置き換える。
 */
const NATIVE_API_BASE = 'http://192.168.0.165:3000'; // TODO: 開発マシンのLAN IPに変更

const isNativeApp =
  typeof window !== 'undefined' &&
  !!(window as any).Capacitor?.isNativePlatform?.();

export const API_BASE = isNativeApp ? NATIVE_API_BASE : 'http://localhost:3000';
