import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'jp.fsmj.app',
  appName: 'FSM Japan',

  // myNewApp のビルド成果物(ブラウザ用)をそのままアプリに同梱する
  webDir: '../myNewApp/dist/my-new-app/browser',

  server: {
    // 開発中はバックエンド(http://<LAN IP>:3000)へ平文HTTPで接続するため許可。
    // 本番ではAPIをHTTPS化して cleartext は無効にすること。
    cleartext: true,
    androidScheme: 'https',
  },
};

export default config;
