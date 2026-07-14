import axios from 'axios';
import { API_BASE } from '../const/api';

/**
 * API呼び出しの共通ヘルパー。
 * 各サービスで繰り返されていた try/catch + console.error + throw を一元化する。
 * エラーは呼び出し元へ再throwされる(握りつぶさない)。
 */

export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  try {
    const response = await axios.get(`${API_BASE}${path}`, { params });
    return response.data as T;
  } catch (error) {
    console.error(`GET ${path} failed:`, error);
    throw error;
  }
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  try {
    const response = await axios.post(`${API_BASE}${path}`, body);
    return response.data as T;
  } catch (error) {
    console.error(`POST ${path} failed:`, error);
    throw error;
  }
}
