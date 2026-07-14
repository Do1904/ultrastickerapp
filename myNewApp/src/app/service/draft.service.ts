import { Injectable } from '@angular/core';

/**
 * オフライン下書き。写真(Blob)ごとIndexedDBに保存するため、
 * 電波のない場所で撮影・下書き保存し、後から投稿できる。
 */
export interface StickerDraft {
  id?: number;
  createdAt: string;
  photo: Blob;
  photoName: string;
  photoType: string;
  countryId: number | null;
  leagueId: number | null;
  clubId: number | null;
  lat: number | null;
  lng: number | null;
  comment: string;
}

const DB_NAME = 'fsmj';
const DB_VERSION = 1;
const STORE = 'drafts';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDb(): Promise<IDBDatabase> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return Promise.reject(new Error('IndexedDB is not available'));
    }
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.dbPromise;
  }

  async saveDraft(draft: StickerDraft): Promise<number> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      const request = tx.objectStore(STORE).put(draft);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async listDrafts(): Promise<StickerDraft[]> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).getAll();
      request.onsuccess = () =>
        resolve(
          (request.result as StickerDraft[]).sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
          )
        );
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDraft(id: number): Promise<void> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      const request = tx.objectStore(STORE).delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
