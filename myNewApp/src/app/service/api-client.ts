import axios from 'axios';
import { API_BASE } from '../const/api';

/**
 * API呼び出しの共通ヘルパー。
 * 各サービスで繰り返されていた try/catch + console.error + throw を一元化する。
 * エラーは呼び出し元へ再throwされる(握りつぶさない)。
 *
 * 認証: ログイン中はFirebaseのIDトークンを Authorization ヘッダーに自動付与する。
 * AuthService を直接importすると循環参照になるため、
 * トークンの取得方法はアプリ起動時に registerTokenProvider() で注入する。
 */

type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;

/** AuthService から呼ばれ、IDトークンの取得方法を登録する */
export function registerTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider;
}

async function authHeaders(): Promise<Record<string, string>> {
  if (!tokenProvider) return {};
  const token = await tokenProvider();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  try {
    const response = await axios.get(`${API_BASE}${path}`, {
      params,
      headers: await authHeaders(),
    });
    return response.data as T;
  } catch (error) {
    console.error(`GET ${path} failed:`, error);
    throw error;
  }
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  try {
    const response = await axios.post(`${API_BASE}${path}`, body, {
      headers: await authHeaders(),
    });
    return response.data as T;
  } catch (error) {
    console.error(`POST ${path} failed:`, error);
    throw error;
  }
}

/** ファイルアップロード用(Content-Typeの境界文字列はブラウザに決めさせる) */
export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  try {
    const response = await axios.post(`${API_BASE}${path}`, formData, {
      headers: await authHeaders(),
    });
    return response.data as T;
  } catch (error) {
    console.error(`POST(form) ${path} failed:`, error);
    throw error;
  }
}
