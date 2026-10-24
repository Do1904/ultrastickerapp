/**
 * Firebase Web SDK の設定。
 *
 * ここに書く値は「秘密情報ではない」。ブラウザに配信される前提の公開識別子で、
 * Firebase公式もクライアントに埋め込む想定としている。
 * 実際のアクセス制御はFirebase Authentication側の設定と、
 * バックエンドのIDトークン検証(firebase-admin)で行う。
 *
 * 取得方法:
 *   Firebaseコンソール > プロジェクトの設定 > 全般
 *   > マイアプリ > ウェブアプリ を追加すると下記の値が表示される。
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyBMcZNsr7Qtez5xcyhd699a3cfFLQm1UYA',
  authDomain: 'ultrastickers-since-2026.firebaseapp.com',
  projectId: 'ultrastickers-since-2026',
  storageBucket: 'ultrastickers-since-2026.firebasestorage.app',
  messagingSenderId: '472111158472',
  appId: '1:472111158472:web:2221ddb664ca25d50d81fd',
  measurementId: 'G-H842MGZSHP',
};

/** 設定が未入力のままかどうか(未設定時に分かりやすいエラーを出すため) */
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith('PASTE_');
